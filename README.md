GERIREPORT - MVP DEL SISTEMA GERIÁTRICO (v2 - Modo Turno)

Este ZIP contiene la versión mejorada del MVP GeriReport, construida
sobre el prototipo original (HTML + CSS + JavaScript, sin backend).

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

Todo se guarda en localStorage del navegador (sin backend, sin base de datos).

Cómo usarlo:
1. Descomprime el ZIP.
2. Abre index.html en tu navegador.
3. Ve a "Pacientes" y presiona "Iniciar turno" sobre María López (o cualquier
   paciente) para ver el flujo completo del Modo Turno.
4. Registra información, revisa la línea temporal, finaliza el turno y
   genera el reporte.
5. Consulta "Reportes" para ver el historial y "Vista familiar" para ver el
   resumen simplificado.

Nota:
Este es un prototipo universitario hecho solo con HTML, CSS y JavaScript.
No realiza diagnósticos médicos ni reemplaza un sistema clínico real.
