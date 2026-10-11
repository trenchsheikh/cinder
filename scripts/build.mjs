import {cp,mkdir,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const file of ['index.html','terminal.html','styles.css','app.js'])await cp(file,`dist/${file}`);
await cp('public','dist',{recursive:true});console.log('Built Cinder into dist/');
