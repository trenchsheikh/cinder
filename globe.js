import * as THREE from '/vendor/three.module.js';

const canvas = document.querySelector('#spark-globe');
const host = canvas?.parentElement;
const fallback = host?.querySelector('.globe-fallback');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let disposed = false;

async function createGlobe() {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
  camera.position.set(0, 0, 6.8);
  const world = new THREE.Group();
  world.rotation.z = -0.12;
  scene.add(world);
  world.add(new THREE.Mesh(new THREE.SphereGeometry(1.65, 64, 40), new THREE.MeshPhongMaterial({color: 0x146394, shininess: 48})));
  scene.add(new THREE.HemisphereLight(0xd8faff, 0x092d59, 2.1));
  const light = new THREE.DirectionalLight(0xffffff, 2.8);
  light.position.set(-3, 4, 5); scene.add(light);
  const landResponse = await fetch('/assets/land-points.json');
  if (!landResponse.ok) throw new Error('Globe geography unavailable');
  const land = await landResponse.json();
  if(disposed){renderer.dispose();return;}
  const positions = new Float32Array(land.length * 3);
  land.forEach(([lon,lat], i) => {
    const phi = lat * Math.PI/180, theta = lon * Math.PI/180;
    positions[i*3] = 1.675 * Math.cos(phi) * Math.sin(theta);
    positions[i*3+1] = 1.675 * Math.sin(phi);
    positions[i*3+2] = 1.675 * Math.cos(phi) * Math.cos(theta);
  });
  const geography = new THREE.BufferGeometry();
  geography.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  // Keep a centred full-globe bound as continents rotate through the view.
  geography.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1.675);
  const pointsMaterial = new THREE.ShaderMaterial({
    uniforms: {color: {value: new THREE.Color(0xc3f7ff)}},
    vertexShader: 'void main(){vec4 p=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*p;gl_PointSize=clamp(10.0/-p.z,1.3,4.0);}',
    fragmentShader: 'uniform vec3 color; void main(){float d=length(gl_PointCoord-0.5);if(d>0.5)discard;gl_FragColor=vec4(color,1.0-smoothstep(0.25,0.5,d));}',
    transparent: true, depthWrite: false
  });
  const continents = new THREE.Points(geography, pointsMaterial);
  // Render the land after the opaque ocean, retaining depth testing for the far side.
  continents.renderOrder = 1;
  continents.frustumCulled = false;
  world.add(continents);
  // Atmospheric rim is real 3D shading, independent of the old raster background.
  world.add(new THREE.Mesh(new THREE.SphereGeometry(1.71, 48, 32), new THREE.ShaderMaterial({
    vertexShader: 'varying vec3 n;varying vec3 v;void main(){vec4 p=modelViewMatrix*vec4(position,1.0);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',
    fragmentShader: 'varying vec3 n;varying vec3 v;void main(){float a=pow(1.0-max(dot(normalize(n),normalize(v)),0.0),3.0);gl_FragColor=vec4(0.52,0.9,1.0,a*0.48);}',
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  })));
  const sparks = [];
  const trailLength = 64;
  for(let i=0;i<3;i++) {
    const orbit = new THREE.Group();
    orbit.rotation.set(i*0.47+0.3, i*0.8, i*0.39);
    const radius = 1.78 + i*0.035;
    const tailGeometry = new THREE.BufferGeometry();
    tailGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(trailLength*3),3).setUsage(THREE.DynamicDrawUsage));
    const colors = new Float32Array(trailLength*3);
    for(let j=0;j<trailLength;j++){const strength=(j/(trailLength-1))**2;colors.set([0.15+strength*0.72,0.45+strength*0.53,0.65+strength*0.35],j*3);}
    tailGeometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
    const trail = new THREE.Line(tailGeometry,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:0.95}));
    // Vertices move around the full orbit; an initial cached bound would cull the moving trail.
    trail.frustumCulled = false;
    orbit.add(trail);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.023,8,8),new THREE.MeshBasicMaterial({color:0xf0fdff}));orbit.add(head);
    scene.add(orbit);sparks.push({head,tailGeometry,radius,phase:i*1.8,speed:1.1+i*0.22});
  }
  let frame=0, previous=null, elapsed=0, sparkElapsed=0, targetX=0, targetY=0, dragX=0, dragY=0, dragging=null;
  function resize(){const {width,height}=host.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.position.z=camera.aspect<0.9?8.6:6.8;camera.updateProjectionMatrix();render();}
  function render(){renderer.render(scene,camera);}
  function draw(time=performance.now()){
    frame=0;
    const delta=previous===null?0:Math.max(0,Math.min((time-previous)/1000,0.1));previous=time;
    // Spark motion is independent of the globe/reduced-motion rotation setting.
    sparkElapsed+=delta;
    if(!motion.matches)elapsed+=delta;
    world.rotation.y=-0.5+elapsed*0.018 + dragY;
    world.rotation.x+=(targetY+dragX-world.rotation.x)*0.08;
    scene.rotation.y+=(targetX-scene.rotation.y)*0.025;
    for(const spark of sparks){
      const angle=spark.phase+sparkElapsed*spark.speed;
      const p=spark.tailGeometry.attributes.position;
      for(let j=0;j<trailLength;j++){const a=angle-(1-j/(trailLength-1))*0.75;p.setXYZ(j,Math.cos(a)*spark.radius,Math.sin(a)*spark.radius,0);}
      p.needsUpdate=true;spark.head.position.set(Math.cos(angle)*spark.radius,Math.sin(angle)*spark.radius,0);
    }
    render();if(!disposed&&!document.hidden)frame=requestAnimationFrame(draw);
  }
  function restart(){if(frame)cancelAnimationFrame(frame);frame=0;previous=null;if(!document.hidden)draw();}
  function pointer(event){
    if(dragging?.id===event.pointerId){
      dragY+=(event.clientX-dragging.x)*0.006;
      dragX=THREE.MathUtils.clamp(dragX+(event.clientY-dragging.y)*0.006,-1.2,1.2);
      dragging.x=event.clientX;dragging.y=event.clientY;
    }else{
      targetX=(event.clientX/innerWidth-0.5)*0.22;
      targetY=(event.clientY/innerHeight-0.5)*0.14;
    }
    if(motion.matches){world.rotation.x=targetY+dragX;world.rotation.y=-0.5+elapsed*0.018+dragY;scene.rotation.y=targetX;render();}
  }
  function startDrag(event){
    if(event.button!==0)return;
    dragging={id:event.pointerId,x:event.clientX,y:event.clientY};
    canvas.setPointerCapture(event.pointerId);canvas.classList.add('dragging');
  }
  function endDrag(event){if(dragging?.id!==event.pointerId)return;dragging=null;canvas.classList.remove('dragging');if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);}
  canvas.addEventListener('pointerdown',startDrag);
  canvas.addEventListener('pointerup',endDrag);
  canvas.addEventListener('pointercancel',endDrag);
  canvas.addEventListener('lostpointercapture',endDrag);
  const observer=new ResizeObserver(resize);observer.observe(host);
  document.addEventListener('visibilitychange',restart);motion.addEventListener('change',restart);window.addEventListener('pointermove',pointer,{passive:true});
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();if(frame)cancelAnimationFrame(frame);canvas.hidden=true;fallback.hidden=false;});
  canvas.addEventListener('webglcontextrestored',()=>{canvas.hidden=false;fallback.hidden=true;restart();});
  window.addEventListener('pagehide',event=>{if(event.persisted)return;disposed=true;if(frame)cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('visibilitychange',restart);motion.removeEventListener('change',restart);window.removeEventListener('pointermove',pointer);scene.traverse(o=>{o.geometry?.dispose();if(o.material){const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose());}});renderer.dispose();},{once:true});
  resize();restart();
}
if(canvas)createGlobe().catch(error=>{console.warn('Spark globe fallback:',error);canvas.hidden=true;fallback.hidden=false;});
