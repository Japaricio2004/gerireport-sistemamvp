# GeriReport

Aplicación React 19 para registrar y consultar cuidados domiciliarios. Todas las pantallas comparten navegación, componentes y estado React; Vite genera las entradas de producción para conservar las URL originales.

Demo funcional con datos ficticios y acceso simulado, sin registro de cuentas ni backend. La sesión y los datos se guardan en el navegador y no se sincronizan entre dispositivos.

## Desarrollo

```bash
npm ci
npm run dev
```

## Producción

```bash
npm run build
npx vite preview
```

Publica el contenido de `dist/`. Todas las rutas siguientes tienen su propio HTML de entrada; no requieren reglas de redirección del servidor.

## Pantallas

- `/`: panel y métricas.
- `/pages/login.html`: inicio de sesión demo con un nombre de usuario y cualquier contraseña.
- `/pages/pacientes.html`: búsqueda por nombre, filtro por estado, registro de pacientes e inicio de turno.
- `/pages/turno.html`: siete tipos de registro, alertas, resumen y generación de reporte.
- `/pages/nuevo-reporte.html`: reporte manual con vista previa.
- `/pages/reportes.html`: historial por paciente, filtros y restablecimiento de demo.
- `/pages/reporte-detalle.html?id=...`: detalle e impresión / PDF.
- `/pages/seguimiento.html`: tareas con cambio de estado.
- `/pages/vista-familiar.html`: resumen del último turno para familiares.
- `/LANDING.html`: portal familiar independiente con su acceso, gráfico, historial y reportes ficticios originales.

Los filtros de historial y vista familiar aceptan `?paciente=Nombre`. Las URL existentes y las claves de almacenamiento se conservan. Cambiar de paciente durante un turno requiere confirmación y guarda el turno anterior como reporte.

## Estructura

- `src/main.jsx`: aplicación y navegación.
- `src/screens.jsx`: pantallas React.
- `src/store.jsx`: estado compartido y persistencia.
- `src/Sidebar.jsx`: menú lateral persistente, fuera del contenido de cada página.
- `src/sidebar.css`: tamaño y estado activo del menú, independientes de los estilos de cada sección.
- `src/components.jsx`: formularios, diálogos y línea temporal.
- `src/DashboardPage.jsx`: panel principal con su diseño original.
- `src/Landing.jsx`: interacciones del portal familiar.
- `src/original/`: estructura JSX y CSS originales de cada pantalla.
- `src/data.js`: datos ficticios, inicialización, resúmenes y reglas de alertas demo.
- `src/preserved.css`: ajustes mínimos para diálogos nativos.
- `src/polish.css`: presentación de las secciones, tarjetas, formularios y adaptación móvil.
- `src/SectionContext.jsx`: resúmenes con datos actuales y guía de registro.
- `assets/css/redesign.css`: tema visual compartido.
- `pages/*.html`, `index.html`, `LANDING.html`: entradas de React.

Los diálogos usan el elemento nativo `dialog` para el foco, cierre con Escape y modalidad. El contenido ingresado se renderiza como texto de React.

## Verificación

```bash
npm test
npm run build
```

## Diseño conservado

La migración mantiene la estructura, clases, estilos, tarjetas, barras laterales y modales del prototipo original. Cada pantalla carga sus estilos originales y el tema compartido en el mismo orden. Las pruebas verifican los estilos contra huellas de la versión anterior y renderizan todas las rutas.

## Inicio de sesión demo

Escribe el nombre de usuario que quieres mostrar y cualquier contraseña no vacía. No necesitas crear una cuenta. Al ingresar, el nombre aparece en el encabezado superior y firma los nuevos turnos y reportes. **Cerrar sesión** permite salir y entrar con otro usuario.

La contraseña no se guarda ni se valida contra cuentas. **Mantener mi sesión iniciada** conserva el usuario entre aperturas; sin marcarlo, la sesión se limita a la pestaña.

Las secciones incluyen indicadores basados en los datos guardados, filtros en pacientes y progreso de tareas. El formulario manual conserva una vista previa lateral que se adapta al ancho de la pantalla.

## Adaptación a pantallas

La hoja compartida src/responsive.css adapta encabezado, menú, tarjetas, formularios, historial y modales. El menú se despliega hasta 1024 px; las columnas se apilan según el espacio disponible. Los modales permiten desplazamiento vertical en pantallas bajas y las tablas del portal familiar conservan desplazamiento horizontal dentro de su contenedor.

Verificación visual de las ocho rutas de trabajo a 320, 390, 768, 1024 y 1440 px, sin desbordamiento horizontal de página. También se revisaron el acceso, el portal familiar y los diálogos de registro y resumen en móvil y horizontal.

## Revisión funcional de la demo

La descarga de reportes genera un PDF A4 directamente con jsPDF y fuentes Montserrat locales (licencia en assets/fonts/OFL.txt). Incluye referencias, secciones y numeración en varias páginas. Los turnos sin atenciones se identifican como Sin registros. Los formularios rechazan campos requeridos que solo contienen espacios y nombres de pacientes duplicados. Los modales permiten cerrar con Escape y mantener el foco dentro de la ventana.

La revisión incluyó un turno ficticio con los siete tipos de registro, recarga, cierre, historial, vista familiar y reporte manual. Se revisaron ocho rutas entre 320 y 1440 px. Safari/iPhone físico queda pendiente por no estar disponible en este equipo.
