# 🚀 Guía de Despliegue Multi-Entorno

Este proyecto soporta despliegue a múltiples hostings con diferentes rutas base.

## 📋 Entornos Configurados

### 1. **Producción** (Hosting Principal)
- **URL**: `https://www.misitio.com/ventanilla/`
- **Base Path**: `/ventanilla/`
- **Archivo env**: `.env.production`

### 2. **Staging** (Hosting Secundario)
- **URL**: `https://projects.misitio.com/2xx/ventanilla/`
- **Base Path**: `/2xx/ventanilla/`
- **Archivo env**: `.env.staging`

## 🛠️ Comandos de Build

### Build para Producción (Hosting 1)
```bash
npm run build:prod
```

### Build para Staging (Hosting 2)
```bash
npm run build:staging
```

### Build local/desarrollo
```bash
npm run dev
```

## 📦 Estructura de Deploy

Después de ejecutar el build, la carpeta `dist/` contendrá:

```
dist/
├── index.html
├── .htaccess          ← Configurado automáticamente según el entorno
├── favicon.ico
└── assets/
    ├── *.js
    ├── *.css
    └── *.png
```

## 🌐 Subir al Hosting

### Hosting 1 (Producción):
1. Ejecuta: `npm run build:prod`
2. Sube el contenido de `dist/` a: `httpdocs/ventanilla/`
3. Accede a: `https://www.misitio.com/ventanilla/`

### Hosting 2 (Staging):
1. Ejecuta: `npm run build:staging`
2. Sube el contenido de `dist/` a: `httpdocs/2xx/ventanilla/`
3. Accede a: `https://projects.misitio.com/2xx/ventanilla/`

## ⚙️ Configuración de Variables de Entorno

### `.env.production`
```env
VITE_BASE_API_URL=https://curaduria2barranquilla.com/apicuraduria2bq/api/ventanilla.php
VITE_BASE_URL=/ventanilla/
VITE_AWS_URL=https://web-curadurias.s3.us-west-1.amazonaws.com/2bq/ventanilla
```

### `.env.staging`
```env
VITE_BASE_API_URL=https://projects.misitio.com/2xx/apicuraduria2bq/api/ventanilla.php
VITE_BASE_URL=/2xx/ventanilla/
VITE_AWS_URL=https://sideprojectsfst.s3.us-west-1.amazonaws.com/ventanilla
```

## 🔧 Archivos .htaccess

Se generan automáticamente según el entorno:
- `public/.htaccess.production` → Para hosting 1
- `public/.htaccess.staging` → Para hosting 2

El script `copy-htaccess.js` copia el correcto antes del build.

## 🚨 Troubleshooting

### Pantalla en blanco después del deploy
1. Verifica que el archivo `.htaccess` se subió correctamente
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que las rutas en el navegador coincidan con `VITE_BASE_URL`

### Error 404 en rutas de Vue Router
- Asegúrate de que el `.htaccess` está en la carpeta correcta
- Verifica que el hosting soporte `.htaccess` (Apache)

### Archivos no se cargan (404)
- Verifica que `VITE_BASE_URL` en el archivo `.env` coincida con la ruta real del hosting
- Reconstruye con el comando correcto: `build:prod` o `build:staging`

## 📧 GitHub Actions

El workflow está configurado en `.github/workflows/deploy.yml` para deploy automático a producción cuando haces push a `main` o `master`.

Para agregar deploy a staging, puedes crear un workflow separado o modificar el existente.
