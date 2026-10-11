import {cp,mkdir,rm} from 'node:fs/promises';
import './geography.mjs';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const file of ['index.html','terminal.html','styles.css','app.js','globe.js','terminal.css','terminal.js','docs.html','docs.css','docs.js','docs-content.js'])await cp(file,`dist/${file}`);
await cp('public','dist',{recursive:true});console.log('Built Spark into dist/');
await mkdir('dist/vendor',{recursive:true});
for(const file of ['three.module.js','three.core.js'])await cp(`node_modules/three/build/${file}`,`dist/vendor/${file}`);
await cp('node_modules/three/LICENSE','dist/vendor/THREE-LICENSE.txt');
