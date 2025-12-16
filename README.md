# DevTree 🌳

Proyecto desarrollado como parte del curso **Integración de Aplicaciones**, donde se implementa una aplicación web fullstack con autenticación, consumo de API y despliegue en la nube.

El objetivo principal fue **desplegar correctamente el backend y el frontend en producción**, asegurando la comunicación entre ambos.

---

## 🧩 Estructura del proyecto

```
devtree/
├── backend/        # API REST (Node.js / Express)
├── frontend/       # Aplicación frontend (React + Vite + TypeScript)
└── README.md
```

---

## 🚀 Despliegue del Backend (Render)

El backend fue desplegado en **Render** como un servicio web.

### Archivos y configuraciones clave:

* `backend/package.json` → define scripts y dependencias
* `backend/src/index.ts` (o `app.ts`) → punto de entrada del servidor
* Uso de `process.env` para variables de entorno

### Variables de entorno configuradas en Render:

* `DATABASE_URL`
* `JWT_SECRET`
* `FRONTEND_URL` → URL del frontend desplegado en Netlify

El backend queda accesible públicamente mediante una URL como:

```
https://devtree-backend-b0xy.onrender.com
```

> El mensaje `Cannot GET /` es normal, ya que la API expone rutas específicas y no una página web.

---

## 🌐 Despliegue del Frontend (Netlify)

El frontend fue desplegado en **Netlify** usando integración directa con GitHub.

### Configuración usada en Netlify:

* **Base directory:** `frontend`
* **Build command:** `npm run build`
* **Publish directory:** `frontend/dist`

### Variable de entorno en Netlify:

```
VITE_API_URL = https://devtree-backend-b0xy.onrender.com
```

Esta variable permite que el frontend consuma correctamente la API del backend en producción.

---

## 🔐 Manejo de autenticación

* El frontend utiliza **Axios** con interceptores (`src/api/axios.ts`)
* El token JWT se guarda en `localStorage`
* Cada request incluye automáticamente el header:

```
Authorization: Bearer <token>
```

---

## 👥 Grupo 09

Todos los integrantes del equipo participaron activamente en:

* Desarrollo del backend
* Implementación del frontend
* Configuración de variables de entorno
* Resolución de errores de build
* Despliegue en Render y Netlify

El repositorio refleja el trabajo colaborativo realizado durante el curso.

---

## ✅ Estado del proyecto

* Backend desplegado y funcional en Render
* Frontend desplegado y funcional en Netlify
* Comunicación correcta entre frontend y backend
