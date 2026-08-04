# Front Cotización

Frontend web para la gestión de entidades relacionadas con **cotizaciones de seguros vehiculares**. Permite administrar de forma centralizada los datos maestros necesarios para el proceso de cotización: riesgos, tomadores, marcas de vehículo, coberturas, deducibles, impuestos y estados.

## Descripción

Aplicación desarrollada con **Angular** que expone una interfaz con menú lateral y pantallas CRUD (crear, leer, actualizar y eliminar) para cada entidad del dominio de cotización. Se comunica con un backend REST mediante `HttpClient`.

## Funcionalidades

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| Datos del Riesgo | `/datos-riesgo` | Gestión de la información del riesgo asegurado |
| Tomadores | `/tomadores` | Administración de tomadores de póliza |
| Marcas de Vehículo | `/marcavehiculo` | Catálogo de marcas de vehículos |
| Coberturas | `/coberturas` | Definición de coberturas del seguro |
| Deducibles | `/deducibles` | Configuración de deducibles |
| Impuestos de Cotización | `/impuestos-cotizacion` | Gestión de impuestos aplicables |
| Estados de Cotización | `/estados-cotizacion` | Catálogo de estados del flujo de cotización |

## Tecnologías

- [Angular](https://angular.io/) 11.2
- [TypeScript](https://www.typescriptlang.org/) 4.1
- [RxJS](https://rxjs.dev/) 6.6
- Angular Forms (reactivos y por plantilla)
- Angular Router con lazy loading del módulo principal

## Estructura del proyecto

```
src/
├── app/
│   ├── cotizacion/              # Módulo principal de cotización
│   │   ├── components/          # Componentes CRUD por entidad
│   │   ├── models/              # Interfaces y modelos de datos
│   │   ├── services/            # Servicios HTTP hacia la API
│   │   └── cotizacion-routing.module.ts
│   ├── shared/                  # Componentes compartidos (menú lateral)
│   ├── app-routing.module.ts
│   └── app.module.ts
└── environments/                  # Configuración por entorno
```

## Requisitos previos

- [Node.js](https://nodejs.org/) (v12 o superior recomendado)
- [npm](https://www.npmjs.com/)
- Backend REST en ejecución (ver sección de configuración)

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd front-cotizacion

# Instalar dependencias
npm install
```

## Ejecución en desarrollo

```bash
npm start
# o equivalentemente: ng serve
```

La aplicación estará disponible en [http://localhost:4200](http://localhost:4200). Los cambios en el código se recargan automáticamente.

## Build de producción

```bash
npm run build
# o: ng build --prod
```

Los artefactos compilados se generan en el directorio `dist/`.

## Configuración de la API

Endpoints consumidos por la aplicación:

| Servicio | Base URL |
|----------|----------|
| Datos del Riesgo | `/api/datos-riesgo` |
| Tomadores | `/api/tomadores` |
| Marcas de Vehículo | `/api/marcavehiculo` |
| Coberturas | `/coverage` |
| Deducibles | `/deducibles` |
| Impuestos | `/api/impuestos-cotizacion` |
| Estados | `/api/estados-cotizacion` |

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo |
| `npm run build` | Compilación del proyecto |
| `npm test` | Tests unitarios (Karma + Jasmine) |
| `npm run lint` | Análisis estático con TSLint |
| `npm run e2e` | Tests end-to-end (Protractor) |

## Tests

```bash
# Tests unitarios
npm test

# Tests end-to-end
npm run e2e
```

## Licencia

Proyecto privado. Consultar al propietario del repositorio para condiciones de uso.
