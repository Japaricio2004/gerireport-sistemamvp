# GeriReport

Aplicación React 19 para registrar y consultar cuidados domiciliarios. Todas las pantallas comparten navegación, componentes y estado React; Vite genera las entradas de producción para conservar las URL originales.

Demo funcional con datos ficticios, cuentas y roles locales simulados, sin backend. La sesión y los datos se guardan en el navegador y no se sincronizan entre dispositivos.

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
- `/pages/login.html`: acceso con las cuentas ficticias indicadas abajo.
- `/pages/pacientes.html`: búsqueda por nombre o código, ficha editable, asignación a técnico, consentimiento, activación y comienzo de turno.
- `/pages/turno.html`: siete tipos de registro, alertas, resumen y generación de reporte.
- `/pages/nuevo-reporte.html`: reporte manual con vista previa.
- `/pages/reportes.html`: historial por paciente, nombre o código, fecha y turno; restablecimiento de demo.
- `/pages/reporte-detalle.html?id=...`: detalle e impresión / PDF.
- `/pages/seguimiento.html`: tareas con cambio de estado.
- `/pages/vista-familiar.html`: vista ilustrativa del último turno, accesible desde la sesión del técnico; el acceso familiar autorizado queda para fase 2.
- `/pages/usuarios.html`: administración local de cuentas y roles, actividad reciente y respaldo JSON; solo para el rol administrador.
- `/LANDING.html`: portal familiar independiente con su acceso, gráfico, historial y reportes ficticios originales.

Los filtros de historial y vista familiar aceptan `?paciente=Nombre`. Las URL existentes y las claves de almacenamiento se conservan. Cambiar de paciente durante un turno requiere confirmación y guarda el turno anterior como reporte. Los registros guardan hora, fecha y técnico; el PDF agrupa las atenciones del turno.

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
- `src/auth.js`, `src/AdminPage.jsx` y `src/backup.js`: cuentas locales, administración y exportación/recuperación de la demo.
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

Accesos iniciales ficticios: **renzo@gerireport.demo / renzo123** (técnico) y **admin@gerireport.demo / admin123** (administrador). El administrador puede crear cuentas, cambiar roles, desactivar usuarios y restablecer contraseñas. Solo se muestran al técnico los pacientes asignados a su nombre y sus reportes; el administrador ve todos y puede reasignarlos. Los pacientes previos sin asignación se migran a Renzo C.; si no tenían consentimiento registrado, deben completarlo antes de iniciar un turno.

Las contraseñas de cuentas nuevas se guardan como derivaciones PBKDF2 con sal local, nunca en texto plano en el almacenamiento. **Mantener mi sesión iniciada** conserva el usuario entre aperturas; sin marcarlo, la sesión se limita a la pestaña. Ambas sesiones caducan tras ocho horas.

**Límite del MVP:** los roles, la auditoría y el consentimiento son simulaciones editables desde el mismo navegador. El respaldo JSON requiere descarga manual y contiene datos ficticios y hashes de cuentas; no es una copia automática ni cifrada. No hay autenticación ni permisos seguros del lado del servidor, HTTPS garantizado por la app ni protección del PDF descargado. Usa únicamente datos ficticios. Antes de tratar datos reales de salud se requiere backend seguro, control de acceso del servidor, política y proceso legal de consentimiento, respaldos automáticos y despliegue HTTPS. El portal familiar independiente también usa contenido ficticio.

Las secciones incluyen indicadores basados en los datos guardados, filtros en pacientes y progreso de tareas. El formulario manual conserva una vista previa lateral que se adapta al ancho de la pantalla.

## Adaptación a pantallas

La hoja compartida src/responsive.css adapta encabezado, menú, tarjetas, formularios, historial y modales. El menú se despliega hasta 1024 px; las columnas se apilan según el espacio disponible. Los modales permiten desplazamiento vertical en pantallas bajas y las tablas del portal familiar conservan desplazamiento horizontal dentro de su contenedor.

Verificación visual de las ocho rutas de trabajo a 320, 390, 768, 1024 y 1440 px, sin desbordamiento horizontal de página. También se revisaron el acceso, el portal familiar y los diálogos de registro y resumen en móvil y horizontal.

## Revisión funcional de la demo

La descarga de reportes genera un PDF A4 directamente con jsPDF y fuentes Montserrat locales (licencia en assets/fonts/OFL.txt). Incluye referencias, secciones y numeración en varias páginas. Los turnos sin atenciones se identifican como Sin registros. Los formularios rechazan campos requeridos que solo contienen espacios y nombres de pacientes duplicados. Los modales permiten cerrar con Escape y mantener el foco dentro de la ventana.

La revisión incluyó un turno ficticio con los siete tipos de registro, recarga, cierre, historial, vista familiar y reporte manual. Se revisaron ocho rutas entre 320 y 1440 px. Safari/iPhone físico queda pendiente por no estar disponible en este equipo.
