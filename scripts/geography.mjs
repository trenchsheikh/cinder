import { readFile,writeFile } from 'node:fs/promises';
import { feature } from 'topojson-client';
const atlas=JSON.parse(await readFile('node_modules/world-atlas/land-110m.json','utf8'));
const land=feature(atlas,atlas.objects.land).features[0].geometry.coordinates;
function insideRing(x,y,ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const [xi,yi]=ring[i],[xj,yj]=ring[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;}return inside;}
const points=[];
for(let lat=-58;lat<84;lat+=1.35){const step=1.35/Math.max(Math.cos(lat*Math.PI/180),0.2);for(let lon=-180;lon<180;lon+=step){if(land.some(poly=>insideRing(lon,lat,poly[0])&&!poly.slice(1).some(r=>insideRing(lon,lat,r))))points.push([+lon.toFixed(3),+lat.toFixed(3)]);}}
await writeFile('public/assets/land-points.json',JSON.stringify(points));
console.log(`Generated ${points.length} globe land points from Natural Earth / world-atlas.`);
