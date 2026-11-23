from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                PageBreak, KeepTogether, HRFlowable)
from reportlab.pdfgen.canvas import Canvas
from xml.sax.saxutils import escape
from pathlib import Path

ROOT = Path(r'C:\Users\japar\Downloads\gerireport_sistema_mvp')
OUT = ROOT / 'output' / 'pdf' / 'guia-testeo-gerireport-5-tecnicos.pdf'
FONT = ROOT / 'assets' / 'fonts'
pdfmetrics.registerFont(TTFont('Montserrat', str(FONT / 'Montserrat-Regular.ttf')))
pdfmetrics.registerFont(TTFont('Montserrat-Bold', str(FONT / 'Montserrat-Bold.ttf')))
pdfmetrics.registerFontFamily('Montserrat', normal='Montserrat', bold='Montserrat-Bold', italic='Montserrat', boldItalic='Montserrat-Bold')

INK = colors.HexColor('#183C35')
GREEN = colors.HexColor('#216D5D')
MINT = colors.HexColor('#EAF4EF')
PALE = colors.HexColor('#F4F8F6')
MUTED = colors.HexColor('#61766F')
LINE = colors.HexColor('#DCE8E2')
GOLD = colors.HexColor('#9A6714')
GOLD_BG = colors.HexColor('#FFF5DF')
RED = colors.HexColor('#A53F3F')
RED_BG = colors.HexColor('#FCEEEE')
WHITE = colors.white

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyGR', fontName='Montserrat', fontSize=8.3, leading=12.3, textColor=INK, spaceAfter=5))
styles.add(ParagraphStyle(name='SmallGR', fontName='Montserrat', fontSize=7.15, leading=9.7, textColor=MUTED, spaceAfter=3))
styles.add(ParagraphStyle(name='TinyGR', fontName='Montserrat', fontSize=6.5, leading=8.5, textColor=MUTED))
styles.add(ParagraphStyle(name='H1GR', fontName='Montserrat-Bold', fontSize=19, leading=23, textColor=INK, spaceBefore=1, spaceAfter=7, keepWithNext=True))
styles.add(ParagraphStyle(name='H2GR', fontName='Montserrat-Bold', fontSize=12, leading=15.5, textColor=GREEN, spaceBefore=7, spaceAfter=5, keepWithNext=True))
styles.add(ParagraphStyle(name='H3GR', fontName='Montserrat-Bold', fontSize=9, leading=12, textColor=INK, spaceBefore=4, spaceAfter=3, keepWithNext=True))
styles.add(ParagraphStyle(name='CoverTitle', fontName='Montserrat-Bold', fontSize=30, leading=35, textColor=WHITE, alignment=TA_LEFT, spaceAfter=8))
styles.add(ParagraphStyle(name='CoverSub', fontName='Montserrat', fontSize=12, leading=17, textColor=colors.HexColor('#D9EEE6')))
styles.add(ParagraphStyle(name='CoverSmall', fontName='Montserrat', fontSize=8.5, leading=13, textColor=colors.HexColor('#EAF4EF')))
styles.add(ParagraphStyle(name='Cell', fontName='Montserrat', fontSize=7.1, leading=9.5, textColor=INK))
styles.add(ParagraphStyle(name='CellSmall', fontName='Montserrat', fontSize=6.55, leading=8.5, textColor=INK))
styles.add(ParagraphStyle(name='CellHead', fontName='Montserrat-Bold', fontSize=7, leading=9, textColor=WHITE))
styles.add(ParagraphStyle(name='Callout', fontName='Montserrat', fontSize=8, leading=11.5, textColor=INK))
styles.add(ParagraphStyle(name='Step', fontName='Montserrat', fontSize=8, leading=11.2, textColor=INK, leftIndent=16, firstLineIndent=-16, spaceAfter=4))
styles.add(ParagraphStyle(name='Quote', fontName='Montserrat-Bold', fontSize=9, leading=13, textColor=INK, leftIndent=8, rightIndent=8, spaceAfter=4))
P = lambda t, style='BodyGR': Paragraph(t, styles[style])
def safe(v): return escape(str(v)).replace('\n','<br/>')
def callout(title, text, bg=MINT, border=GREEN):
    t = Table([[P('<b>'+title+'</b><br/>'+text, 'Callout')]], colWidths=[170*mm])
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),bg),('BOX',(0,0),(-1,-1),0.7,border),('LINEBEFORE',(0,0),(0,-1),3,border),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
    return t
def step(n, title, desc): return P(f'<b>{n}. {title}</b> - {desc}', 'Step')
def table(rows, widths, header=True, small=False, aligns=None):
    cooked=[]
    for ri,row in enumerate(rows):
        cooked.append([x if hasattr(x,'getPlainText') else P(safe(x), 'CellHead' if header and ri==0 else ('CellSmall' if small else 'Cell')) for x in row])
    t=Table(cooked, colWidths=widths, repeatRows=1 if header else 0, hAlign='LEFT')
    cmds=[('VALIGN',(0,0),(-1,-1),'TOP'),('GRID',(0,0),(-1,-1),0.35,LINE),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]
    if header: cmds += [('BACKGROUND',(0,0),(-1,0),GREEN)]
    start=1 if header else 0
    for ri in range(start,len(rows)):
        if (ri-start)%2==1: cmds.append(('BACKGROUND',(0,ri),(-1,ri),PALE))
    if aligns:
        for col,al in enumerate(aligns): cmds.append(('ALIGN',(col,0),(col,-1),al))
    t.setStyle(TableStyle(cmds)); return t
def heading(kicker,title,sub=None):
    els=[P(kicker.upper(),'SmallGR'),P(title,'H1GR'),HRFlowable(width='100%',thickness=1,color=LINE,spaceAfter=8)]
    if sub: els += [P(sub,'BodyGR'),Spacer(1,3)]
    return els

class NumberedCanvas(Canvas):
    def __init__(self,*a,**kw): Canvas.__init__(self,*a,**kw); self._saved_page_states=[]
    def showPage(self): self._saved_page_states.append(dict(self.__dict__)); self._startPage()
    def save(self):
        total=len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state); self.draw_page_number(total); Canvas.showPage(self)
        Canvas.save(self)
    def draw_page_number(self,total):
        if self._pageNumber==1: return
        w,h=A4
        self.saveState(); self.setStrokeColor(LINE); self.setLineWidth(.6); self.line(20*mm,14*mm,w-20*mm,14*mm)
        self.setFont('Montserrat',7); self.setFillColor(MUTED)
        self.drawString(20*mm,9*mm,'GeriReport  |  Guía de prueba de usabilidad')
        self.drawRightString(w-20*mm,9*mm,f'{self._pageNumber} / {total}')
        self.restoreState()

def on_page(c, doc):
    if doc.page==1:
        w,h=A4; c.saveState(); c.setFillColor(INK); c.rect(0,0,w,h,fill=1,stroke=0)
        c.setFillColor(GREEN); c.roundRect(19*mm,h-73*mm,24*mm,24*mm,6*mm,fill=1,stroke=0)
        c.setFillColor(WHITE); c.setFont('Montserrat-Bold',15); c.drawCentredString(31*mm,h-59*mm,'GR')
        c.setFillColor(colors.HexColor('#6DB69B')); c.roundRect(19*mm,28*mm,38*mm,2*mm,1*mm,fill=1,stroke=0)
        c.restoreState()
    else:
        w,h=A4; c.saveState(); c.setFillColor(GREEN); c.rect(0,h-3*mm,w,3*mm,fill=1,stroke=0); c.restoreState()

story=[]
# Cover
story += [Spacer(1,70*mm),P('PLAN DE PRUEBA','CoverSmall'),Spacer(1,5*mm),P('GeriReport','CoverTitle'),P('Guía práctica para evaluar la demo con 5 técnicos y pacientes ficticios','CoverSub'),Spacer(1,12*mm),P('Un recorrido completo por inicio de sesión, pacientes, turnos, reportes, seguimiento, vista familiar y experiencia móvil.','CoverSmall'),Spacer(1,27*mm)]
coverinfo=Table([[P('<b>5</b><br/>técnicos participantes','CoverSmall'),P('<b>5</b><br/>pacientes ficticios','CoverSmall'),P('<b>35-45 min</b><br/>por persona','CoverSmall')]],colWidths=[54*mm]*3)
coverinfo.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#24594D')),('BOX',(0,0),(-1,-1),0.5,colors.HexColor('#427C6D')),('INNERGRID',(0,0),(-1,-1),0.5,colors.HexColor('#427C6D')),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),10),('BOTTOMPADDING',(0,0),(-1,-1),10)]))
story += [coverinfo,Spacer(1,11*mm),P('Material de evaluación académica  |  Prototipo funcional de demostración  |  3 de noviembre de 2026','CoverSmall'),PageBreak()]

# 1
story += heading('01 / Antes de empezar','Objetivo y preparación','El propósito es observar si cada técnico puede completar tareas reales de la demo y entender lo que ve, sin que el moderador le indique cómo resolverlas.')
story += [P('Qué se evalúa','H2GR'),table([
['Área','Qué comprobar'],['Acceso','El técnico escribe su nombre y entra; el nombre queda visible durante la sesión.'],['Pacientes','Puede registrar, buscar, filtrar y seleccionar a una persona ficticia.'],['Turno','Registra las siete clases de cuidado y entiende el resumen antes de cerrarlo.'],['Reportes','Encuentra el reporte, abre su detalle y descarga el PDF.'],['Seguimiento y familia','Mueve una tarea entre estados y consulta el resumen del paciente.'],['Responsive','Puede leer y usar las pantallas en escritorio y en un móvil sin desplazamiento horizontal.']],[37*mm,133*mm]),P('Materiales','H2GR'),P('Computadora con la demo abierta en <b>http://localhost:5173</b>, teléfono móvil o vista adaptable del navegador, cronómetro y esta guía impresa o abierta aparte. Mantén el servidor de desarrollo ejecutándose durante toda la sesión.'),P('Organización recomendada','H2GR'),table([
['Minutos','Actividad'],['0-3','Explicar la demo, obtener conformidad y aclarar que los datos son ficticios.'],['3-8','Ingreso, identificación y creación del paciente.'],['8-22','Inicio del turno y registro de cuidados.'],['22-28','Resumen, cierre del turno e informe PDF.'],['28-34','Nuevo reporte manual, historial, seguimiento y vista familiar.'],['34-40','Prueba responsive, preguntas finales y registro de observaciones.']],[28*mm,142*mm]),Spacer(1,5),callout('Importante: es una demo','El acceso no valida cuentas reales: basta escribir el nombre del técnico y cualquier contraseña no vacía. Los datos se guardan en el almacenamiento local de ese navegador. No introduzcan datos de personas reales ni interpreten los avisos como diagnóstico o recomendación clínica.',GOLD_BG,GOLD),PageBreak()]

# 2 personas
story += heading('02 / Participantes','Técnicos y pacientes de prueba','Asigna una persona ficticia a cada participante. No cambies los nombres durante el recorrido porque el historial y la vista familiar se vinculan por el nombre del paciente.')
people=[
['Técnico','Paciente ficticio','Edad','Condición ficticia','Familiar responsable'],
['Renzo','Lucía Torres',79,'Movilidad reducida; seguimiento general','Rosa Torres'],
['Daniela','Mateo Rivas',84,'Hipertensión; escenario de alertas de demo','Javier Rivas'],
['Gabriel','Sofía Méndez',76,'Diabetes; observar registro de alimentación','Paula Méndez'],
['Sandro','Elena Quispe',88,'Movilidad; escenario de incidente ficticio','Luis Quispe'],
['Jorge','Diego Salas',81,'Hidratación y seguimiento general','Marta Salas'],
]
story += [table(people,[25*mm,29*mm,13*mm,61*mm,42*mm],small=True),P('Valores para el turno','H2GR'),table([
['Técnico','Presión / FC / Temp / SpO2','Medicación','Alimentación','Otros datos'],
['Renzo','118/76 / 72 / 36.6 / 98','Losartán 50 mg; 1 tableta; Administrado; 08:00','Desayuno; 75%; “Buen apetito”','Sueño 7 h, Buena; higiene bucal; Bien'],
['Daniela','180/110 / 105 / 38.1 / 93','Medicamento demo; 1 tableta; No administrado; 08:15','Desayuno; 0%; “Registro ficticio de rechazo”','Sueño 5 h, Mala; baño; Cansado'],
['Gabriel','120/80 / 74 / 36.7 / 97','Metformina 850 mg; 1 tableta; Administrado; 08:30','Almuerzo; 75%; “Consumo parcial ficticio”','Sueño 6.5 h, Regular; cambio de ropa; Bien'],
['Sandro','122/78 / 68 / 36.5 / 98','Medicamento demo; 1 dosis; Administrado; 09:00','Desayuno; 100%; “Registro ficticio”','Sueño 7 h, Buena; higiene general; Tranquilo; 1 incidente'],
['Jorge','125/82 / 80 / 36.8 / 97','Vitamina demo; 1 unidad; Administrado; 09:15','Merienda; 100%; “Registro ficticio”','Sueño 7.5 h, Buena; baño + bucal; Bien'],
],[18*mm,42*mm,39*mm,34*mm,37*mm],small=True),Spacer(1,5),callout('Valores solo para probar reglas visibles','Los números ficticios de Daniela y el incidente de Sandro están elegidos para comprobar cómo la demo marca registros para revisar. No son consejos médicos, umbrales clínicos ni instrucciones de cuidado. Si aparece un aviso, registra qué texto muestra y si se entiende.',RED_BG,RED),P('Variación visual: durante la prueba de responsive, Renzo o Jorge pueden usar su mismo paciente y datos; no hace falta duplicar el registro para medir la pantalla.','SmallGR'),PageBreak()]

# 3 orientation, detailed walkthrough
story += heading('03 / Cómo hacer la prueba','Para el técnico y para quien acompaña','El técnico puede ser nuevo en GeriReport. Esta guía da un recorrido completo. Para medir facilidad de uso, primero lee solo la consigna neutral; deja que intente la tarea. Si pide ayuda o se bloquea, usa el recorrido detallado para acompañarlo y registra qué ayuda recibió.')
story += [P('Antes de abrir la aplicación','H2GR'),step('1','Preparar una sesión limpia','En la computadora, abre un perfil de navegador separado para la persona que va a probar. No uses la misma ventana de otro técnico: la demo guarda pacientes, reportes y turno activo en el navegador. Deja abierta esta guía en otro dispositivo o imprímela.'),step('2','Confirmar que el servidor está listo','El moderador comprueba que la demo esté ejecutándose. En la barra de direcciones del navegador escribe <b>http://localhost:5173</b> y presiona Enter. No busques GeriReport en internet: localhost se abre en la misma computadora donde está ejecutándose el proyecto.'),step('3','Leer la introducción','Dile al técnico que probará un prototipo académico con información inventada. No hay respuestas correctas sobre la app, y puede preguntar o parar. No usar información real de pacientes.'),P('Consigna neutral para el técnico','H2GR'),callout('Leer antes de dar instrucciones','“Vas a realizar un turno de demostración para [nombre del paciente asignado]. Completa los cuidados que te entrego y al final busca el reporte para confirmar que quedó guardado. Si algo no te queda claro, dime qué esperabas ver.”',PALE,LINE),P('Si la meta de la clase es una prueba guiada, lee los pasos de las páginas siguientes. Si la meta es medir si la interfaz se entiende por sí sola, no muestres los pasos hasta que la persona intente o pida ayuda. En ambos casos el técnico será nuevo; lo que cambia es si le damos la ruta antes o después de observar su intento.','BodyGR'),P('A. Iniciar sesión: qué poner','H2GR'),step('4','Abrir la pantalla correcta','Si aparece una página de presentación, ubica y pulsa el acceso para iniciar sesión. Si ya ves el formulario con el título <b>Iniciar sesión</b>, continúa allí.'),step('5','Escribir el nombre del técnico','Toca el campo <b>Usuario</b> y escribe el nombre asignado exactamente: Renzo, Daniela, Gabriel, Sandro o Jorge.'),step('6','Escribir la contraseña demo','Toca <b>Contraseña</b> y escribe <b>Demo2026</b>. Esta es solo una clave ficticia para que el campo requerido acepte el ingreso; no se crea ni se valida una cuenta real.'),step('7','Ingresar','Deja “Mantener mi sesión iniciada” sin marcar para esta sesión. Pulsa <b>Ingresar al sistema</b>. Espera a que cargue el Dashboard. En la parte superior debe aparecer el nombre del técnico; si aparece otro nombre, cierra sesión y repite con el usuario correcto.'),PageBreak()]

story += heading('04 / Crear al paciente','Registro explicado campo por campo','Cada técnico crea una sola ficha usando la fila que le corresponde en la tabla “Técnicos y pacientes de prueba” de la página 3.')
story += [step('8','Entrar a Pacientes','Busca el menú lateral de la aplicación. Pulsa <b>Pacientes</b>. Si estás en teléfono y solo ves el contenido principal, pulsa primero el icono de menú (tres líneas) del encabezado; elige Pacientes en la lista.'),step('9','Abrir el formulario','Pulsa el botón <b>Nuevo paciente</b>. Aparecerá una ventana llamada <b>Registrar paciente</b>. Si no se ve completa en teléfono, desplázate dentro de la ventana hasta poder alcanzar los campos y el botón inferior.'),P('Completa cada campo copiando la fila de tu paciente asignado','H2GR'),table([
['Campo que aparece','Qué escribir','Ejemplo Renzo'],
['Nombre completo','Copia el nombre ficticio de tu fila. Conserva nombre y apellido.','Lucía Torres'],
['Edad','Copia la edad en números, sin escribir “años”.','79'],
['Condición principal','Copia la condición ficticia de la tabla.','Movilidad reducida; seguimiento general'],
['Familiar responsable','Copia el familiar ficticio.','Rosa Torres'],
],[39*mm,83*mm,48*mm],small=True),step('10','Guardar la ficha','Pulsa <b>Guardar paciente</b> una vez. Espera a que se cierre el formulario. Si un campo queda vacío, la página debe señalarlo y no guardar hasta completarlo.'),step('11','Encontrar la tarjeta','En la lista de Pacientes busca la tarjeta con el nombre recién creado. Confirma visualmente la edad, condición y familiar. La tarjeta inicialmente muestra el estado <b>Estable</b>.'),step('12','Probar búsqueda','En el cuadro de búsqueda escribe el primer nombre del paciente. Confirma que aparezca su tarjeta. Borra el texto para volver a ver la lista.'),step('13','Probar filtro','Abre el filtro de estado, elige <b>Estable</b> y confirma que el paciente siga visible. Luego elige <b>Todos</b> para dejar la lista en su condición inicial.'),P('Si no aparece un paciente','H2GR'),P('Comprueba que el texto de búsqueda se haya borrado, que el filtro esté en “Todos” y que el nombre se haya guardado sin un error. No vuelvas a guardar la ficha con un nombre ligeramente diferente para ocultar el problema: anota lo ocurrido y pide al moderador que verifique el perfil del navegador.'),Spacer(1,3),callout('Prueba de duplicado opcional','Sin guardar una segunda ficha, pulsa Nuevo paciente, escribe el mismo nombre que ya existe y completa los otros campos. Pulsa Guardar paciente. La demo debería indicar que ese nombre ya está registrado. Cierra el formulario con la X; no guardes otro duplicado.',GOLD_BG,GOLD),PageBreak()]

story += heading('05 / Comenzar el turno','Elegir a la persona correcta','El turno es el espacio donde se van agregando las observaciones de una atención. Antes de registrar, confirma paciente y técnico para que el reporte no termine asociado a otra persona.')
story += [step('14','Volver a la lista','En el menú lateral pulsa Pacientes. Localiza la tarjeta creada con el nombre de tu paciente.'),step('15','Iniciar atención','En la tarjeta pulsa <b>Iniciar turno</b>. No uses la tarjeta de otro paciente. Si la tarjeta muestra “Continuar turno”, eso significa que ya hay un turno abierto para esa persona; púlsalo para reanudarlo.'),step('16','Revisar el destino','La aplicación abre <b>Modo Turno</b>. Lee el encabezado: debe mostrar el nombre de tu paciente y debajo los datos del turno y del técnico. Si los nombres no coinciden con la ficha asignada, detente y avisa al moderador antes de registrar.'),P('Qué contiene Modo Turno','H2GR'),P('En la parte superior se ve el paciente y un botón <b>Finalizar turno</b>. Debajo hay botones para Signos vitales, Medicación, Alimentación, Sueño, Higiene, Bienestar e Incidente. Cada formulario se abre como una ventana encima de la página. Al guardar, esa ventana se cierra y el evento aparece en la sección <b>Línea temporal del turno</b>.'),P('Cómo copiar los datos','H2GR'),P('Busca la fila de tu técnico en la página 3. Los datos de esa fila son los que debes usar en los formularios de las páginas siguientes. Utiliza solo esos datos. El tiempo de las horas es un dato ficticio para que el campo de hora acepte un valor.'),P('Si se abre una confirmación sobre otro turno','H2GR'),P('No pulses “Continuar” a ciegas. Lee el nombre del paciente y el texto completo. En un perfil de navegador nuevo no debería haber un turno anterior. Si aparece uno, puede que el perfil ya se haya utilizado: cancela, cambia al perfil de navegador limpio o informa al moderador.'),Spacer(1,4),callout('Comprobación antes de seguir','Paciente correcto + técnico correcto + turno activo. En la zona de acciones deben verse los botones de cuidado y el área de línea temporal. No registres todavía hasta confirmar los nombres.',MINT,GREEN),PageBreak()]

story += heading('06 / Registrar signos y medicación','Qué tocar y qué escribir','Después de cada formulario pulsa su botón Guardar una sola vez. Espera a que se cierre la ventana y revisa que el nuevo evento aparezca en la línea temporal.')
story += [P('A. Signos vitales','H2GR'),step('17','Abrir el formulario','En Modo Turno pulsa <b>Signos vitales</b>. En la ventana “Registrar signos vitales” verás cuatro campos: presión arterial, frecuencia cardíaca, temperatura y saturación.'),step('18','Copiar los cuatro valores','En <b>Presión arterial</b> escribe el formato con barra, por ejemplo 118/76. En <b>Frecuencia cardíaca (lpm)</b> escribe solo el número. En <b>Temperatura (°C)</b> escribe el valor decimal. En <b>Saturación de oxígeno (%)</b> escribe el número del porcentaje, sin el signo %. Copia los cuatro valores de la fila de tu técnico en la página 3.'),step('19','Guardar y comprobar','Pulsa <b>Guardar registro</b>. Debe cerrarse el formulario. En la línea temporal busca “Signos vitales” y verifica que presión, FC, temperatura y SpO2 coincidan con lo que escribiste. Si la pantalla rechaza la presión, usa dos o tres números, una barra y dos o tres números; por ejemplo, 120/80.'),P('B. Medicación','H2GR'),step('20','Abrir la ventana','En la pantalla de turno pulsa <b>Medicación</b>. Se abre “Registrar medicación”.'),step('21','Completar nombre y dosis','En <b>Medicamento</b> escribe exactamente el nombre de la fila asignada. En <b>Dosis</b> escribe la unidad textual, por ejemplo “1 tableta” o “1 dosis”.'),step('22','Completar hora y estado','En <b>Hora</b> escribe la hora de la tabla. El control usa formato de 24 horas: 08:00 significa ocho de la mañana. Abre <b>Estado</b> y elige Administrado o No administrado según la fila del participante.'),step('23','Guardar y comprobar','Pulsa <b>Guardar registro</b>. En la línea temporal debe aparecer el nombre, dosis y estado. En la prueba de Daniela el estado “No administrado” debe quedar explícito; no cambies esa selección para evitar el aviso.'),P('Si elegiste algo por error','H2GR'),P('No hay un botón de edición de eventos dentro del turno de prueba. Antes de guardar, revisa el contenido. Si ya se guardó mal, no inventes una solución borrando datos: anota el error y continúa con la siguiente categoría si el turno permite hacerlo.'),PageBreak()]

story += heading('07 / Alimentación, sueño e higiene','Tres formularios del turno','Los botones siempre están en Modo Turno. Después de guardar uno, vuelve a la página de turno para elegir el siguiente.')
story += [P('A. Alimentación','H2GR'),step('24','Abrir y elegir comida','Pulsa <b>Alimentación</b>. En el formulario “Registrar alimentación”, abre <b>Comida</b> y elige la comida indicada en la fila: Desayuno, Almuerzo, Cena o Merienda.'),step('25','Elegir consumo','Abre <b>Cantidad consumida</b>. Elige exactamente el porcentaje de la tabla: 100 %, 75 %, 50 %, 25 % o 0 %. En el campo opcional Nota, escribe el texto breve entre comillas de la fila.'),step('26','Guardar','Pulsa <b>Guardar registro</b>. En la línea temporal verifica que aparezca la comida, el porcentaje y la nota si la añadiste. Un 75 % se resume como parcial; no crea por sí solo un aviso de revisión. Un 0 % sí marca un registro para revisar en esta demo.'),P('B. Sueño','H2GR'),step('27','Abrir y llenar horas','Pulsa <b>Sueño</b>. En “Horas de sueño” escribe la cantidad de la fila, por ejemplo 6.5. El campo acepta medias horas.'),step('28','Elegir calidad','En <b>Calidad del descanso</b> elige Buena, Regular o Mala, tal como dice la fila de tu técnico. Pulsa <b>Guardar registro</b>.'),P('C. Higiene','H2GR'),step('29','Marcar una o más actividades','Pulsa <b>Higiene</b>. Debajo de Actividades realizadas marca cada casilla indicada en la fila: Baño, Higiene bucal, Cambio de ropa o Higiene general. Puedes marcar varias.'),step('30','Guardar y confirmar','Pulsa <b>Guardar registro</b>. Verifica que la línea temporal indique las actividades marcadas. Si no marcaste ninguna, aparecerá un mensaje para seleccionar al menos una; marca una y vuelve a guardar.'),Spacer(1,3),callout('Qué hacer si falta una opción','No sustituyas por una opción que no representa el dato. Anota que la opción requerida no estaba disponible y avisa al moderador. Así se conserva el hallazgo de la prueba.',PALE,LINE),PageBreak()]

story += heading('08 / Bienestar e incidente','Completar las últimas acciones','Bienestar se guarda eligiendo una opción. Incidente se utiliza solo para el caso asignado a Sandro, de forma que el grupo pruebe tanto el turno normal como un aviso de revisión.')
story += [P('A. Bienestar','H2GR'),step('31','Mostrar opciones','En Modo Turno pulsa <b>Bienestar</b>. Se abre un cuadro con estados observados como Bien, Tranquilo y Cansado.'),step('32','Elegir el estado asignado','Pulsa exactamente el estado de la columna “Otros datos” de tu fila en la página 3. La selección registra el bienestar en el turno. Confirma que aparezca como un nuevo elemento en la línea temporal.'),P('B. Incidente: solo Sandro','H2GR'),step('33','Abrir el formulario','Sandro pulsa <b>Incidente</b>. Los otros técnicos omiten este botón en su turno; no hace falta inventar incidentes adicionales.'),step('34','Elegir tipo','En el campo <b>Tipo</b> abre la lista y selecciona <b>Otro</b>.'),step('35','Describir el hecho','En <b>Descripción</b> escribe exactamente: “Molestia leve en el brazo referida por la persona; sin lesión visible. Registro ficticio para evaluar el formulario.” El sistema pide una descripción objetiva, no una conclusión o diagnóstico.'),step('36','Poner hora y guardar','En <b>Hora</b> escribe 10:30. Pulsa <b>Guardar incidente</b>. Revisa la línea temporal: debe aparecer el incidente, la hora y la descripción.'),P('Leer el aviso de revisión','H2GR'),P('Daniela y Sandro deben detenerse unos segundos para leer el aviso que aparece en la pantalla. Pregúntales: “¿Qué entiendes que te está diciendo?” No les expliques el significado hasta que hayan respondido. La demo marca algunos registros para verificar; ese aviso no es diagnóstico, alerta clínica enviada a alguien ni recomendación médica.'),P('Revisar el conteo','H2GR'),P('La pantalla muestra el total de registros del turno. Cuenta que coincida con las acciones que guardaste: Renzo, Daniela, Gabriel y Jorge deben tener seis registros (vitales, medicación, comida, sueño, higiene y bienestar); Sandro tendrá siete porque registra además un incidente.'),PageBreak()]

story += heading('09 / Finalizar y guardar el turno','Entender el resumen antes de cerrar','El botón Finalizar turno abre una revisión previa. El reporte solo se crea cuando se pulsa Generar reporte dentro de esa ventana.')
story += [step('37','Abrir el resumen','En la cabecera de Modo Turno pulsa <b>Finalizar turno</b>. Busca la ventana titulada <b>Resumen del turno</b>. En escritorio debería quedar centrada; en móvil, desplázate dentro del cuadro si el contenido es más alto que la pantalla.'),step('38','Leer sus partes','En la parte superior confirma el nombre del paciente. Revisa el estado Sin alertas o Revisar registros, la fecha, hora de inicio y de finalización. Más abajo revisa “Cuidados registrados”: cada categoría muestra cuántos eventos tiene. La sección de incidentes indica cuántos se registraron.'),step('39','Entender antes de continuar','Daniela y Sandro leen la explicación “Para revisar” y dicen con sus propias palabras qué harían. Si algo parece ambiguo, anótalo. No cierres todavía si hay un dato equivocado; usa Seguir turno para volver, si corresponde.'),step('40','Escribir una observación general','Al final del resumen, en el campo <b>Observaciones generales (opcional)</b>, escribe: “Prueba de usabilidad realizada con datos ficticios.” Esta observación quedará en el reporte.'),step('41','Generar el informe','Pulsa <b>Generar reporte</b>. La aplicación guarda el turno y te lleva a su página de detalle. El turno deja de estar activo. Revisa que el paciente y el técnico coincidan con la sesión.'),P('Descargar el PDF del turno','H2GR'),step('42','Buscar la descarga','En el detalle pulsa <b>Descargar PDF</b>. Espera el mensaje o que el navegador inicie la descarga. Abre el archivo desde la bandeja de descargas del navegador.'),step('43','Revisar el documento','En el PDF comprueba que se lea el nombre del paciente, fecha, tipo de reporte, autor/técnico, estado, registros agrupados y observación. Revisa primera y última sección y si hay páginas adicionales. Anota si una línea se corta, se superpone o queda sin datos.'),P('Diferenciar guardar de descargar','H2GR'),P('Generar reporte lo guarda en GeriReport y permite volver a verlo en la aplicación. Descargar PDF crea un archivo para compartir o imprimir. Si se descarga pero no se ve en pantalla, no vuelvas a generar un segundo reporte: revisa la lista de descargas del navegador.'),PageBreak()]

story += heading('10 / Reporte manual','Llenar cada campo sin turno activo','Esta pantalla prueba una forma alternativa de documentar una atención. Gabriel debe hacerla como tarea asignada; si el profesor quiere que los cinco recorran todo, los cinco pueden completarla.')
story += [step('44','Abrir el formulario','Desde el menú lateral pulsa <b>Nuevo reporte</b>. En teléfono puede ser necesario abrir el menú con el icono de tres líneas. Espera a que aparezca la página “Nuevo reporte geriátrico”.'),P('Llena los campos en el orden que aparecen','H2GR'),table([
['Campo','Qué escribir o elegir'],
['Paciente','Abre la lista y selecciona el paciente ficticio creado para este técnico.'],
['Turno','Abre la lista y selecciona Mañana.'],
['Presión arterial','Copia la presión de la fila de este técnico en la página 3, con una barra: por ejemplo 118/76.'],
['Frecuencia cardíaca','Copia el número de lpm de la fila, sin escribir “lpm”.'],
['Temperatura','Copia el valor decimal de la fila, por ejemplo 36.6.'],
['Medicamentos administrados','Copia el nombre y dosis ficticios de la fila. Ejemplo: “Losartán 50 mg - 1 tableta - 08:00”.'],
['Alimentación e hidratación','Escribe la comida, el porcentaje y la nota asignados. Ejemplo: “Desayuno: 75 %; buen apetito. Registro ficticio”.'],
['Incidentes o alertas','Para Renzo, Daniela, Gabriel y Jorge escribe “Sin incidentes”. Sandro escribe “Incidente ficticio de prueba; molestia leve en el brazo referida, sin lesión visible”.'],
['Observaciones generales','Escribe “Reporte manual de prueba de usabilidad con datos ficticios”.'],
],[47*mm,123*mm],small=True),step('45','Usar la vista previa','Mientras se escribe, mira el panel <b>Vista previa</b>. Comprueba que muestre los datos que acabas de ingresar. Si la pantalla es estrecha, baja hasta la vista previa debajo del formulario.'),step('46','Guardar y revisar','Pulsa <b>Guardar y generar reporte</b>. Se abre el detalle. Verifica paciente, turno “Mañana”, signos vitales y texto de medicamentos, alimentación, incidentes y observaciones.'),P('Si un dato requerido está vacío','H2GR'),P('El navegador debe señalar el campo que falta y quedarse en el formulario. Completa solo el dato asignado; no inventes datos reales. Los incidentes son opcionales, pero para que el formulario no confunda los campos se recomienda escribir “Sin incidentes” cuando no se registró ninguno.'),PageBreak()]

story += heading('11 / Historial, familia y seguimiento','Encontrar el resultado que guardaste','Estas pantallas permiten confirmar que el registro quedó guardado y mostrarlo en distintas vistas.')
story += [P('A. Historial de reportes','H2GR'),step('47','Entrar al historial','Abre el menú lateral y pulsa <b>Reportes</b>. Esta es la lista de informes guardados en el perfil de navegador actual.'),step('48','Filtrar al paciente','Busca el rótulo <b>Filtrar por paciente</b>. Abre la lista y selecciona el nombre de tu paciente. No pulses “Restablecer demo”; esa acción borra los datos que acabas de crear.'),step('49','Abrir el informe correcto','En el grupo con el nombre de tu paciente, compara la fecha y el turno. En el reporte más reciente pulsa <b>Ver reporte</b>. Revisa el mismo detalle que se abrió al guardar. Usa el botón de volver del navegador para retornar al historial.'),P('B. Vista familiar','H2GR'),step('50','Abrir la vista','En el menú lateral pulsa <b>Vista familiar</b>. En la parte superior busca <b>Selecciona al paciente</b>. Abre la lista y elige el nombre ficticio asignado.'),step('51','Leer el resumen familiar','Debajo del selector revisa edad y condición. Con un reporte guardado deben aparecer el estado, fecha del último reporte, turno, signos vitales y número de elementos para revisar. Más abajo se ve un resumen de alimentación, medicación, higiene y bienestar.'),step('52','Ver el reporte completo','En el bloque <b>Último reporte</b> pulsa <b>Ver reporte</b>. Confirma que el documento pertenece al paciente seleccionado. Vuelve con el navegador para seguir.'),P('C. Seguimiento','H2GR'),step('53','Abrir tablero','En el menú lateral pulsa <b>Seguimiento</b>. Aparecen columnas Pendiente, En proceso y Completado. Ubica la tarjeta “Control de presión”.'),step('54','Mover la tarjeta','En su tarjeta pulsa <b>Pasar a En proceso</b>. Confirma que la tarjeta aparece bajo la columna En proceso. Pulsa luego <b>Pasar a Completado</b> y confirma que se movió a Completado. Para devolverla, usa el control de volver a En proceso y luego a Pendiente.'),P('D. Volver y cerrar sesión','H2GR'),step('55','Dashboard','En el menú pulsa <b>Dashboard</b>. Observa el saludo, el resumen numérico y las tarjetas. Si el sidebar queda diferente de las otras secciones, anota en qué página y qué tamaño de ventana ocurre.'),step('56','Cerrar sesión','En el menú lateral pulsa <b>Cerrar sesión</b>. Debe volver a la pantalla Iniciar sesión. Entra el siguiente participante solo en su propio perfil de navegador.'),Spacer(1,3),callout('Restablecer la demo solo al final','El botón de Reportes llamado “Restablecer demo” elimina cambios del perfil y repone datos ficticios de ejemplo. No lo uses entre las tareas de un participante. Si el siguiente técnico usa otro perfil, sus datos quedan separados del anterior.',GOLD_BG,GOLD),PageBreak()]

story += heading('12 / Teléfono y validaciones','Un recorrido también en móvil','En teléfono realiza una segunda pasada abreviada, idealmente con Jorge o con quien haya terminado primero. Usa el mismo paciente de prueba para no duplicar información.')
story += [P('Preparar el tamaño móvil','H2GR'),step('57','Abrir vista adaptable','En una computadora, usa las herramientas del navegador para escoger un dispositivo cercano a 390 px de ancho. Si se usa un teléfono real, abre la misma dirección local dentro de la red configurada por el equipo; localhost en el teléfono apunta al propio teléfono y no a la computadora.'),step('58','Abrir y cerrar el menú','Pulsa las tres líneas del encabezado. El menú lateral debe aparecer sin empujar el contenido a un lado ni producir una franja horizontal para poder leerlo. Pulsa una sección; comprueba que puedes volver al contenido. Abre/cierra el menú otra vez.'),step('59','Probar paciente y formulario','Entra a Pacientes, pulsa Nuevo paciente y verifica que el cuadro quede en medio de la pantalla. Desplázate dentro del cuadro para acceder al botón inferior. Para no crear otra persona, puedes cerrar el formulario sin guardar.'),step('60','Probar resumen del turno','En un turno activo de demostración, abre Finalizar turno. Comprueba que la ventana esté centrada y que puedas desplazarte hasta ambos botones. Pulsa Seguir turno para cerrar el resumen sin terminar el turno.'),step('61','Probar el historial','Abre Reportes y comprueba que las tarjetas y Ver reporte entren en la pantalla. Intenta recorrer horizontalmente: la página no debería requerir arrastrar una barra horizontal para llegar al contenido esencial.'),P('Si tienes solo una persona probando','H2GR'),P('Haz primero el flujo completo en escritorio. Luego reduce la ventana a 390 px y repite únicamente menú, formulario de paciente (abrir y cerrar), modal Resumen del turno (abrir y seguir), historial y detalle. Anota cada diferencia; no es necesario volver a guardar el turno.'),P('Validaciones opcionales para el moderador','H2GR'),P('Estas comprobaciones cambian el estado de la pantalla pero no deben añadir datos inválidos al historial. Hazlas con la guía de moderador, no durante la parte no asistida.'),table([
['Prueba','Dónde y qué probar','Qué debe pasar'],['Campo requerido','Paciente > Nuevo paciente. Dejar Condición principal vacía y pulsar Guardar paciente.','El navegador señala lo que falta y no agrega la ficha. Cerrar luego sin guardar.'],['Solo espacios','En el requerido Nombre completo, escribir espacios y tratar de guardar.','No debe aceptarlos como un nombre. Cerrar sin guardar.'],['Edad','Probar temporalmente -1 o 121.','El control numérico rechaza valores fuera del límite. No guardar.'],['Formato de presión','En Modo Turno > Signos vitales, probar 120-80.','Muestra la ayuda del formato presión/barra; cerrar sin guardar.'],['Higiene vacía','Abrir Higiene y pulsar Guardar sin marcar casillas.','Pide escoger al menos una; marcarla solo si se continuará ese turno.'],['Búsqueda vacía','En Pacientes buscar una cadena inexistente y luego borrar.','Explica que no encuentra resultados; borrar restaura la lista.'],
],[32*mm,75*mm,63*mm],small=True),PageBreak()]

#9 moderation + tracking
story += heading('09 / Hoja de observación','Anotar lo que pasa, no lo que esperabas','Una sesión pequeña sirve para encontrar problemas y recoger impresiones. No representa a todos los técnicos ni demuestra eficacia clínica.')
story += [P('Guion para leer al inicio','H2GR'),callout('Leer literalmente','“Gracias por participar. Hoy probamos la demo, no tus conocimientos. Todo lo que verás es ficticio. Si algo no se entiende, dime qué esperabas encontrar. Mientras realizas las tareas, piensa en voz alta. No te diré dónde pulsar de inmediato; primero observaré cómo lo resolverías. Puedes detenerte cuando quieras.”'),P('Registro por participante','H2GR'),table([
['Participante / fecha','Dispositivo y ancho','Inicio / fin','¿Completó sin ayuda?','Pistas dadas'],
['Renzo: ____________________','____________________','________ / ________','Sí / Parcial / No','________________________'],
['Daniela: __________________','____________________','________ / ________','Sí / Parcial / No','________________________'],
['Gabriel: __________________','____________________','________ / ________','Sí / Parcial / No','________________________'],
['Sandro: ___________________','____________________','________ / ________','Sí / Parcial / No','________________________'],
['Jorge: ____________________','____________________','________ / ________','Sí / Parcial / No','________________________'],
],[35*mm,34*mm,28*mm,40*mm,33*mm],small=True),P('Notas de observación','H2GR'),table([
['Tarea / pantalla','Qué hizo o dijo la persona (cita breve)','Problema / impacto','Severidad'],
['Ingreso / encabezado','____________________________________________','________________________','1  2  3'],
['Paciente','____________________________________________','________________________','1  2  3'],
['Turno / modal','____________________________________________','________________________','1  2  3'],
['Reporte / PDF','____________________________________________','________________________','1  2  3'],
['Móvil / sidebar','____________________________________________','________________________','1  2  3'],
],[32*mm,67*mm,48*mm,23*mm],small=True),P('Severidad sugerida: 1 = detalle visual; 2 = confunde o ralentiza; 3 = bloquea la tarea o puede inducir a un error de registro.','SmallGR'),PageBreak()]

#10 survey metrics
story += heading('10 / Cierre y resultados','Preguntas y resumen del test','Al terminar las tareas, deja que cada técnico responda sin sugerir la respuesta. Usa la misma escala para las cinco personas.')
story += [P('Encuesta breve (1 = muy difícil / muy en desacuerdo; 5 = muy fácil / muy de acuerdo)','H2GR'),table([
['Pregunta','1','2','3','4','5'],
['Pude reconocer quién inició sesión.','[ ]','[ ]','[ ]','[ ]','[ ]'],
['Encontré rápido la sección que necesitaba.','[ ]','[ ]','[ ]','[ ]','[ ]'],
['Entendí cómo registrar cada cuidado.','[ ]','[ ]','[ ]','[ ]','[ ]'],
['Entendí el resumen y qué significan sus avisos.','[ ]','[ ]','[ ]','[ ]','[ ]'],
['Pude encontrar y abrir el reporte guardado.','[ ]','[ ]','[ ]','[ ]','[ ]'],
['La versión móvil fue cómoda de usar.','[ ]','[ ]','[ ]','[ ]','[ ]'],
],[85*mm,17*mm,17*mm,17*mm,17*mm,17*mm],small=True),P('Dos preguntas abiertas','H2GR'),table([
['Pregunta','Respuesta'],
['¿Qué fue lo más confuso o molesto?','\n\n'],
['¿Qué cambiarías primero?','\n\n'],
],[65*mm,105*mm],small=True),P('Cálculos sencillos para presentar al profesor','H2GR'),table([
['Métrica','Cómo obtenerla','Qué informa'],
['Éxito de tarea','Tareas completadas sin pista / tareas asignadas x 100.','Si cada flujo principal se entiende sin ayuda.'],
['Tiempo por tarea','Minutos desde leer la consigna hasta completar.','Qué pasos consumen tiempo o generan dudas.'],
['Errores observados','Número de errores que impiden avanzar o exigen repetir.','Dónde conviene priorizar una mejora.'],
['Facilidad percibida','Promedio de las seis respuestas de 1 a 5.','Percepción del grupo de prueba; no generalizar más allá de estos cinco.'],
],[36*mm,69*mm,65*mm],small=True),P('Resumen final para completar','H2GR'),table([
['Resultado','Dato del grupo'],['Técnicos que completaron el acceso sin ayuda','____ de 5'],['Turnos guardados correctamente','____ de 5'],['Descargas PDF revisadas','____ de ____ intentos'],['Problemas severidad 3','_______________________________________________'],['Mejora prioritaria y por qué','_______________________________________________'],['Comentario más representativo','_______________________________________________']],[73*mm,97*mm]),PageBreak()]

story += heading('11 / Síntesis para entregar','Conclusiones y próximos pasos','Usa esta hoja para convertir las observaciones del test en cambios concretos para la demo.')
story += [callout('Conclusión responsable','El resultado describe únicamente esta sesión académica con cinco técnicos y pacientes inventados. Presenta problemas detectados, tareas completadas, tiempos y opiniones. No afirmes que la app mejora resultados clínicos ni que representa a todos los usuarios.',MINT,GREEN),Spacer(1,7),P('Hallazgos priorizados','H2GR'),table([
['Prioridad','Problema observado y evidencia','Mejora propuesta','Responsable / fecha'],
['1 - bloquea','\n\n','\n\n','\n\n'],
['2 - confunde','\n\n','\n\n','\n\n'],
['3 - visual','\n\n','\n\n','\n\n'],
],[22*mm,57*mm,55*mm,42*mm],small=True),Spacer(1,9),P('¿Qué aprendimos del test?','H2GR'),table([
['Pregunta','Respuesta del equipo'],
['¿Qué tarea fue más fácil y por qué?','\n\n'],
['¿Qué tarea costó más y qué patrón se repitió?','\n\n'],
['¿Qué cambio probaríamos primero en una segunda ronda?','\n\n'],
['¿Qué quedó fuera de esta prueba?','\n\n'],
],[74*mm,102*mm],small=True),Spacer(1,8),P('Fecha de la presentación: ____________________     Integrantes: _________________________________________________','SmallGR')]


doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=20*mm,leftMargin=20*mm,topMargin=16*mm,bottomMargin=21*mm,title='GeriReport - Guia de testeo con cinco tecnicos',author='GeriReport',subject='Protocolo de prueba de usabilidad con pacientes ficticios')
doc.build(story,onFirstPage=on_page,onLaterPages=on_page,canvasmaker=NumberedCanvas)
print(OUT)
print(OUT.stat().st_size)
