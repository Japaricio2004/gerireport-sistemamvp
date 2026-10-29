import {readFileSync,writeFileSync} from 'node:fs';
import {buildReportPdf} from '../../src/reportPdf.js';
import {initialize,read,keys} from '../../src/data.js';
const values=new Map(); globalThis.localStorage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v))}; initialize();
const fonts={normal:readFileSync('assets/fonts/Montserrat-Regular.ttf').toString('base64'),bold:readFileSync('assets/fonts/Montserrat-Bold.ttf').toString('base64')};
const normal=read(keys.reports,[]).find(r=>r.id===2);
const cases={
  'reporte-demo':normal,
  'reporte-largo':{...normal,patient:'Paciente de demostración con nombre largo para revisar la presentación del documento', notes:('Texto de demostración para comprobar los saltos de página, los acentos y la legibilidad de las observaciones. ').repeat(90)+'FIN DE OBSERVACIONES'},
  'reporte-vacio':{...normal,id:'demo-vacio',records:[],status:'Estable',notes:''},
};
for(const [name,report] of Object.entries(cases)){
 const doc=buildReportPdf(report,fonts);
 writeFileSync(`output/pdf/${name}.pdf`,Buffer.from(doc.output('arraybuffer')));
 console.log(name,doc.getNumberOfPages(),'pages');
}
