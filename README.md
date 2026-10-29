# GeriReport

Prototipo interactivo para registrar y consultar turnos de cuidado domiciliario. Incluye un dashboard hecho con React y flujos de demostración en HTML, CSS y JavaScript.

> **Solo demostración:** todos los pacientes y reportes son ficticios. La aplicación guarda datos en el navegador, no tiene backend y no debe usarse para decisiones clínicas.

## Requisitos

- Node.js 18.x, 20.x o 22+ (versiones compatibles con Vite 6).
- npm.

## Ejecutar en local

```bash
npm ci
npm run dev
```

Abre la dirección que Vite muestra en la terminal, normalmente `http://localhost:5173/`. El dashboard está en la raíz. Para entrar a la pantalla de acceso demo directamente, abre `/pages/login.html`; cualquier correo y contraseña permiten continuar.

Para generar y revisar la versión de producción:

```bash
npm run build
npx vite preview
```

Vite crea los archivos de publicación en `dist/`. El servidor de desarrollo es solo para trabajar en local.

## Recorrido de la demo

1. En el dashboard, abre **Pacientes**.
2. Pulsa **Iniciar turno** en cualquier tarjeta. Si ya hay otro turno abierto, el prototipo te pedirá confirmar el cambio.
3. En **Modo Turno**, registra signos vitales, medicación, alimentación, sueño, higiene, bienestar o un incidente. Cada registro aparece en la línea temporal.
4. Finaliza el turno, revisa el resumen y genera el reporte.
5. Consulta el reporte en **Reportes**, abre su detalle o revisa el resumen desde **Vista familiar**.
6. En **Seguimiento**, mueve las tareas demo entre sus estados.

Los formularios, confirmaciones y avisos usan componentes de la interfaz. Los indicadores de signos vitales son ejemplos configurados para la demo; no constituyen diagnóstico ni recomendación médica.

## Pantallas

| Ruta | Contenido |
| --- | --- |
| `/` | Dashboard React con accesos y resumen del prototipo |
| `/pages/login.html` | Acceso ficticio para la demostración |
| `/pages/pacientes.html` | Pacientes demo, alta local, inicio de turno e historial por paciente |
| `/pages/turno.html` | Registro del turno, modales, alertas y línea temporal |
| `/pages/nuevo-reporte.html` | Creación manual de un reporte |
| `/pages/reportes.html` | Historial, filtro por paciente y restablecimiento de la demo |
| `/pages/reporte-detalle.html` | Detalle de un reporte e impresión del navegador |
| `/pages/seguimiento.html` | Tareas demo que se pueden cambiar de estado |
| `/pages/vista-familiar.html` | Resumen simplificado para familiares |
| `/LANDING.html` | Página informativa independiente del prototipo |

## Datos de demostración

Al abrir la app por primera vez se cargan seis pacientes y reportes de ejemplo. Los cambios se conservan en `localStorage` del navegador: pacientes, turno activo, reportes y tareas. No se sincronizan entre navegadores ni dispositivos.

Para volver al estado inicial, usa **Restablecer demo** en la pantalla de reportes. Esto elimina los cambios guardados por este prototipo en el navegador actual y vuelve a cargar los datos ficticios.

## Tecnologías

- React 19 y React DOM para el dashboard.
- Vite 6 para desarrollo y compilación multipágina.
- HTML, CSS y JavaScript para las pantallas del flujo demo.
- `localStorage` como almacenamiento local temporal.

## Estructura del proyecto

```text
src/main.jsx              Dashboard React
pages/                    Pantallas HTML del prototipo
assets/css/                Estilos generales y tema visual
assets/js/                 Interacciones, datos demo y lógica local
assets/img/                Recursos gráficos
LANDING.html               Página informativa
vite.config.js             Configuración multipágina de Vite
```
