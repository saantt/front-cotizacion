# Front Cotización

> Frontend web para la gestión de entidades relacionadas con **cotizaciones de seguros vehiculares**.

Aplicación desarrollada en **Angular** que centraliza los datos maestros necesarios para el proceso de cotización: riesgos, tomadores, marcas de vehículo, coberturas, deducibles, impuestos y estados. Expone una interfaz con menú lateral y pantallas CRUD (crear, leer, actualizar, eliminar) para cada entidad del dominio, comunicándose con un backend REST mediante `HttpClient`.

---

## Tabla de contenidos

- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Ejecución en desarrollo](#ejecución-en-desarrollo)
- [Build de producción](#build-de-producción)
- [Configuración de la API](#configuración-de-la-api)
- [Scripts disponibles](#scripts-disponibles)
- [Tests](#tests)
- [Convenciones de código](#convenciones-de-código)
- [Licencia](#licencia)

---

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
│   ├── cotizacion/                   # Módulo principal de cotización
│   │   ├── components/               # Componentes CRUD por entidad
│   │   ├── models/                   # Interfaces y modelos de datos
│   │   ├── services/                 # Servicios HTTP hacia la API
│   │   └── cotizacion-routing.module.ts
│   ├── shared/                       # Componentes compartidos (menú lateral, etc.)
│   ├── app-routing.module.ts
│   └── app.module.ts
└── environments/                     # Configuración por entorno (dev, prod)
```

## Requisitos previos

- [Node.js](https://nodejs.org/) v12 o superior
- [npm](https://www.npmjs.com/) v6 o superior
- [Angular CLI](https://angular.io/cli) 11.x (`npm install -g @angular/cli@11`)
- Backend REST en ejecución y accesible (ver [Configuración de la API](#configuración-de-la-api))

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
# equivalente a: ng serve
```

La aplicación queda disponible en [http://localhost:4200](http://localhost:4200). Los cambios en el código se recargan automáticamente.

Antes de levantar el proyecto, verifica que la URL del backend esté correctamente configurada en `src/environments/environment.ts`.

## Build de producción

```bash
npm run build
# equivalente a: ng build --prod
```

Los artefactos compilados se generan en el directorio `dist/`, listos para desplegar en cualquier servidor de archivos estáticos.

## Configuración de la API

Los endpoints consumidos actualmente son:

| Servicio | Endpoint |
|----------|----------|
| Datos del Riesgo | `/api/datos-riesgo` |
| Tomadores | `/api/tomadores` |
| Marcas de Vehículo | `/api/marcavehiculo` |
| Coberturas | `/api/coberturas` |
| Deducibles | `/api/deducibles` |
| Impuestos | `/api/impuestos-cotizacion` |
| Estados | `/api/estados-cotizacion` |


## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Levanta el servidor de desarrollo |
| `npm run build` | Compila el proyecto para producción |
| `npm test` | Ejecuta los tests unitarios (Karma + Jasmine) |
| `npm run lint` | Análisis estático con TSLint |
| `npm run e2e` | Ejecuta los tests end-to-end (Protractor) |

## Tests

```bash
# Tests unitarios
npm test

# Tests end-to-end
npm run e2e
```

## Convenciones de código

- Sigue la [guía de estilo oficial de Angular](https://angular.io/guide/styleguide).
- Un componente por entidad, con su respectivo servicio HTTP en `services/`.
- Los modelos de datos deben tiparse en `models/` en lugar de usar `any`.
- Ejecuta `npm run lint` antes de abrir un pull request.

## Licencia

Proyecto privado. Consultar al propietario del repositorio para condiciones de uso.