import {createServer} from 'vite';
import {createServer as http} from 'node:http';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {readFileSync,writeFileSync} from 'node:fs';
const values=new Map(); globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v))};
const server=await createServer({server:{middlewareMode:true,hmr:{server:http()}},appType:'custom'});
try {
const {ReportContent}=await server.ssrLoadModule('/src/screens.jsx');
const {initialize,read,keys}=await server.ssrLoadModule('/src/data.js'); initialize();
const reports=read(keys.reports,[]);
const styles=['src/original/reporte-detalle.css','assets/css/redesign.css','src/polish.css','src/responsive.css'].map(p=>readFileSync(p,'utf8')).join('\n').replaceAll('@media print','@media all');
writeFileSync('tmp/pdfs/print-preview.html','<!doctype html><html lang="es"><meta charset="utf-8"><style>'+styles+'\nbody{padding:16mm!important;width:210mm!important;box-sizing:border-box!important;margin:auto!important}</style><div id="root"><div class="workspace-frame"><div class="workspace-layout"><div class="workspace-page"><div class="app-shell"><main class="main-content"><section id="reportSheet">'+renderToString(React.createElement(ReportContent,{report:reports.find(r=>r.id===2)||reports[0]}))+'</section></main></div></div></div></div></div></html>');
}finally{await server.close();}
