GERIREPORT - MVP DEL SISTEMA GERIÁTRICO (v2 - Modo Turno)

Este proyecto mejora el prototipo GeriReport con un panel principal en React y
un estilo común para todos los flujos. Conserva los formularios y registros del
prototipo, que se guardan en el navegador y no requieren backend.

FLUJO PRINCIPAL A DEMOSTRAR:
Login → Pacientes → Iniciar turno → Modo Turno (registrar información) →
Línea temporal → Alerta si hay valor fuera de rango → Finalizar turno →
Resumen → Generar reporte → Reporte → Historial → Vista familiar

Páginas incluidas:
- index.html                  Dashboard principal.
- pages/login.html            Login demo (acceso libre).
- pages/pacientes.html        Registro/listado de pacientes + botón "Iniciar turno".
- pages/turno.html            Modo Turno: registro rápido de signos vitales,
                               medicación, alimentación, sueño, higiene,
                               bienestar e incidentes, con línea temporal y
                               alertas de valores fuera de rango.
- pages/reporte-detalle.html  Vista completa de un reporte, con botón
                               "Descargar / Imprimir" (usa window.print()).
- pages/reportes.html         Historial de reportes agrupado por paciente
                               (turnos + reportes rápidos), con filtro.
- pages/nuevo-reporte.html    Formulario manual de reporte rápido (se conserva
                               del prototipo original).
- pages/seguimiento.html      Tablero de alertas y tareas (kanban demo).
- pages/vista-familiar.html   Vista simplificada para familiares, sin
                               información técnica.

Funcionalidades nuevas (MVP):
- Modo Turno con registro rápido por categorías (signos vitales, medicación,
  alimentación, sueño, higiene, bienestar, incidentes) usando modales.
- Línea temporal automática de cada turno.
- Alertas visuales cuando un signo vital se sale del rango configurado
  (demostrativo, no es un diagnóstico médico).
- Finalización de turno con resumen y generación automática de reporte.
- Reporte detallado, listo para imprimir o guardar como PDF desde el navegador.
- Historial de turnos por paciente (trazabilidad).
- Vista familiar simplificada con el estado del último turno.
- Datos ficticios de ejemplo (paciente María López y otros) para poder
  demostrar el prototipo sin cargar información manualmente.

La demo incluye seis pacientes ficticios y reportes de ejemplo, con registros
estables y alertas para recorrer los estados principales. Pacientes, turnos,
tareas y reportes se guardan en localStorage (sin backend ni base de datos).
En "Historial", usa "Restablecer demo" para recuperar los datos iniciales.
El tablero de seguimiento permite mover las tareas entre estados y conserva
esos cambios en el navegador hasta restablecer la demo.

Cómo usarlo:
1. Instala Node.js.
2. En la carpeta del proyecto, ejecuta `npm install` y luego `npm run dev`.
3. Abre en el navegador la dirección local que muestre Vite.
4. Ve a "Pacientes" y presiona "Iniciar turno" sobre María López (o cualquier
   paciente) para ver el flujo completo del Modo Turno.
5. Registra información, revisa la línea temporal, finaliza el turno y
   genera el reporte.
6. Consulta "Reportes" para ver el historial y "Vista familiar" para ver el
   resumen simplificado.

Para preparar la versión de publicación, ejecuta `npm run build`. Los archivos
quedan en `dist/`.

Nota:
Este es un prototipo universitario con React y flujos heredados en HTML/CSS/JavaScript.
No realiza diagnósticos médicos ni reemplaza un sistema clínico real.
