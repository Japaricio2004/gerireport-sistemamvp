import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildReportPdf} from '../src/reportPdf.js';
const report={id:'test-pdf',type:'turno',patient:'Paciente Demo',technician:'Tecnico Demo',date:'29/10/2026',startTime:'08:00',endTime:'12:00',records:[],notes:''};
test('PDF empty turn has explicit empty state and a single A4 page',()=>{
 const pdf=buildReportPdf(report);
 assert.equal(pdf.getNumberOfPages(),1);
 assert.ok(Math.abs(pdf.internal.pageSize.getWidth()-210)<.1);
 assert.ok(pdf.output().includes('sin registros de atenci'));
});
test('PDF paginates long notes and keeps the final text and page footer',()=>{
 const pdf=buildReportPdf({...report,notes:'Texto largo de prueba para verificar todos los saltos del documento. '.repeat(200)+'ULTIMO REGISTRO'});
 assert.ok(pdf.getNumberOfPages()>1);
 assert.ok(pdf.output().includes('ULTIMO REGISTRO'));
 assert.ok(pdf.output().includes(`${pdf.getNumberOfPages()} / ${pdf.getNumberOfPages()}`));
});
test('manual PDF contains patient, care sections and notes',()=>{
 const pdf=buildReportPdf({id:'manual',type:'manual',patient:'PACIENTE DEMO',technician:'Demo',createdAt:'29/10/2026',shift:'Tarde',pressure:'120/80',meds:'REGISTRO MEDICACION',food:'REGISTRO ALIMENTACION',notes:'OBSERVACION FINAL'});
 const text=pdf.output();
 for(const marker of ['PACIENTE DEMO','REGISTRO MEDICACION','REGISTRO ALIMENTACION','OBSERVACION FINAL']) assert.ok(text.includes(marker));
});

test('shift PDF includes recorded respiration, hydration and responsible technician',()=>{
 const pdf=buildReportPdf({...report,records:[
  {type:'vitals',time:'08:10',detail:'FR: 18 rpm',responsible:'Renzo C.',data:{}},
  {type:'food',time:'09:00',title:'Desayuno',detail:'Hidratación: 250 ml',responsible:'Renzo C.',data:{}},
 ]});
 const text=pdf.output();
 for(const marker of ['FR: 18 rpm','Hidrataci','Renzo C.']) assert.ok(text.includes(marker));
});
