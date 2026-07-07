# La Belle Robe — API REST

API REST para la tienda de ropa en línea **La Belle Robe**, desarrollada como parcial práctico de Ingeniería de Software. Permite gestionar usuarios, catálogo de productos con variantes (talla + color + stock), pedidos y pagos, con autenticación JWT y autorización por roles.

---

## URLs

| Recurso | URL |
|---|---|
| API desplegada | https://mongo-la-belle-robe.onrender.com |
| Health check | https://mongo-la-belle-robe.onrender.com/api/health |
| Repositorio | https://github.com/MariaGarcia27/mongo_la_belle_robe |
| Frontend | https://la-belle-robe-app.vercel.app |

---

## Tecnologías

- **Node.js** + **Express** — servidor y rutas
- **MongoDB** + **Mongoose** — base de datos y modelado
- **JWT** (jsonwebtoken) — autenticación con token
- **bcryptjs** — cifrado de contraseñas
- **express-validator** — validación de datos de entrada
- **Helmet** — cabeceras de seguridad HTTP
- **CORS** — control de orígenes permitidos
- **express-rate-limit** — límite de intentos en rutas sensibles
- **dotenv** — variables de entorno
- Desplegado en **Render** con base de datos en **MongoDB Atlas**

---

## Estructura del proyecto

```
la-belle-robe-api/
├── server.js              # Punto de entrada
├── app.js                 # Configuración de Express
├── .env.example           # Variables de entorno de ejemplo
└── src/
    ├── config/
    │   └── db.js          # Conexión a MongoDB
    ├── models/
    │   ├── Usuario.js
    │   ├── Producto.js
    │   ├── Pedido.js
    │   └── Pago.js
    ├── controllers/
    │   ├── authController.js
    │   ├── productoController.js
    │   ├── pedidoController.js
    │   └── pagoController.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── productoRoutes.js
    │   ├── pedidoRoutes.js
    │   └── pagoRoutes.js
    ├── middlewares/
    │   ├── authMiddleware.js      # Verifica JWT
    │   ├── roleMiddleware.js      # Verifica rol
    │   ├── validationMiddleware.js
    │   └── errorMiddleware.js     # Manejo global de errores
    └── services/
        ├── authService.js
        └── productoService.js
```

---

## Instalación local

### Requisitos
- Node.js 18+
- pnpm
- MongoDB local o conexión a MongoDB Atlas

```bash
git clone https://github.com/MariaGarcia27/mongo_la_belle_robe.git
cd mongo_la_belle_robe
pnpm install
```

Copia el archivo de variables de entorno y complétalo:

```bash
cp .env.example .env
```

Ejecuta el seed para crear datos iniciales:

```bash
pnpm seed
```

Inicia el servidor en modo desarrollo:

```bash
pnpm dev
```

La API estará disponible en `http://localhost:5000`.

---

## Variables de entorno

Crea un archivo `.env` basado en `.env.example`:

> Nunca subas el `.env` real al repositorio.

---

## Roles y permisos

| Rol | Permisos |
|---|---|
| `cliente` | Ver catálogo, crear pedidos, ver sus pedidos y pagos, ver su perfil |
| `admin` | Todo lo anterior + CRUD de productos, ver todos los pedidos y pagos, actualizar estado de pedidos, ver lista de usuarios |

> Los usuarios se registran siempre como `cliente`. El rol `admin` solo se asigna mediante el seed.

### Casos de autorización demostrados

| Caso | Ejemplo |
|---|---|
| Usuario autenticado SÍ accede | `GET /api/pedidos/mis-pedidos` con token válido |
| Usuario autenticado rechazado por rol | `GET /api/pedidos` con token de cliente → 403 |
| Usuario sin token rechazado | Cualquier ruta protegida sin token → 401 |

---

## Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Admin | admin@labellerobe.com | admin123 |
| Cliente | cliente@labellerobe.com | cliente123 |

---

## Endpoints

### Auth

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/auth/register` | Registrar nuevo usuario | Público |
| POST | `/api/auth/login` | Iniciar sesión y obtener token | Público |
| GET | `/api/auth/profile` | Ver perfil del usuario autenticado | Autenticado |
| PUT | `/api/auth/profile` | Actualizar perfil | Autenticado |
| GET | `/api/auth/usuarios` | Listar todos los usuarios | Admin |
| GET | `/api/health` | Health check de la API | Público |

#### POST /api/auth/register
```json
// Request body
{
  "nombre": "Ana López",
  "correo": "ana@example.com",
  "password": "segura123"
}

// Response 201
{
  "mensaje": "Usuario registrado exitosamente.",
  "token": "eyJhbGciOi...",
  "usuario": {
    "_id": "664f...",
    "nombre": "Ana López",
    "correo": "ana@example.com",
    "rol": "cliente"
  }
}
```

#### POST /api/auth/login
```json
// Request body
{
  "correo": "admin@labellerobe.com",
  "password": "admin123"
}

// Response 200
{
  "mensaje": "Inicio de sesión exitoso.",
  "token": "eyJhbGciOi...",
  "usuario": {
    "_id": "664f...",
    "nombre": "Admin",
    "correo": "admin@labellerobe.com",
    "rol": "admin"
  }
}
```

---

### Productos

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/productos` | Listar todos los productos activos | Público |
| GET | `/api/productos/:id` | Obtener producto por ID | Público |
| POST | `/api/productos` | Crear producto | Admin |
| PUT | `/api/productos/:id` | Actualizar producto | Admin |
| DELETE | `/api/productos/:id` | Desactivar producto (soft delete) | Admin |

> Las rutas GET de productos son públicas. POST, PUT y DELETE requieren token de admin.

#### POST /api/productos
```json
// Headers: Authorization: Bearer <token>
// Request body
{
  "nombre": "Vestido Floral",
  "descripcion": "Vestido de verano con estampado floral",
  "precio": 89.99,
  "categoria": "vestidos",
  "imagen": "https://ejemplo.com/imagen.jpg",
  "variantes": [
    { "talla": "S", "color": "rojo", "stock": 10 },
    { "talla": "M", "color": "azul", "stock": 5 }
  ]
}

// Response 201
{
  "mensaje": "Producto creado exitosamente.",
  "producto": {
    "_id": "665a...",
    "nombre": "Vestido Floral",
    "precio": 89.99,
    "activo": true,
    "variantes": [...]
  }
}
```

---

### Pedidos

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/pedidos` | Crear pedido (descuenta stock automáticamente) | Autenticado |
| GET | `/api/pedidos` | Listar todos los pedidos | Admin |
| GET | `/api/pedidos/mis-pedidos` | Ver pedidos del usuario autenticado | Autenticado |
| PUT | `/api/pedidos/:id/estado` | Actualizar estado del pedido | Admin |

#### POST /api/pedidos
```json
// Headers: Authorization: Bearer <token>
// Request body
{
  "items": [
    {
      "productoId": "665a...",
      "talla": "S",
      "color": "rojo",
      "cantidad": 2
    }
  ],
  "tipoEntrega": "domicilio"
}

// Response 201
{
  "mensaje": "Pedido creado exitosamente.",
  "pedido": {
    "_id": "666b...",
    "usuarioId": "664f...",
    "items": [...],
    "total": 179.98,
    "estado": "Pendiente",
    "tipoEntrega": "domicilio"
  }
}
```

#### PUT /api/pedidos/:id/estado
```json
// Headers: Authorization: Bearer <token admin>
// Request body
{ "estado": "Enviado" }

// Estados válidos: Pendiente | Pagado | Enviado | Entregado

// Response 200
{
  "mensaje": "Estado actualizado exitosamente.",
  "pedido": { "_id": "666b...", "estado": "Enviado" }
}
```

---

### Pagos

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/api/pagos` | Registrar pago de un pedido | Autenticado |
| GET | `/api/pagos` | Listar todos los pagos | Admin |
| GET | `/api/pagos/mis-pagos` | Ver pagos del usuario autenticado | Autenticado |

#### POST /api/pagos
```json
// Headers: Authorization: Bearer <token>
// Request body — pago con tarjeta
{
  "pedidoId": "666b...",
  "metodoPago": "tarjeta",
  "montoPagado": 179.98,
  "estadoPago": "completado",
  "datosTarjeta": {
    "ultimosDigitos": "4242"
  }
}

// Request body — pago en efectivo
{
  "pedidoId": "666b...",
  "metodoPago": "efectivo",
  "montoPagado": 179.98,
  "estadoPago": "completado"
}

// Response 201
{
  "mensaje": "Pago registrado exitosamente.",
  "pago": {
    "_id": "667c...",
    "pedidoId": "666b...",
    "metodoPago": "tarjeta",
    "estadoPago": "completado",
    "fechaPago": "2025-01-15T..."
  }
}
```

---

## Seguridad implementada

- Contraseñas cifradas con **bcryptjs** (nunca devueltas en respuestas)
- Token JWT validado en cada ruta protegida
- Rol verificado antes de acciones críticas
- **Helmet** activo para cabeceras HTTP seguras
- **CORS** restringido a orígenes permitidos (localhost + Vercel)
- **Rate limiting** en `/api/auth/login`: máximo 10 intentos por 15 minutos
- Soft delete en usuarios y productos (campo `activo`) — no se eliminan físicamente
- Stack trace nunca expuesto al cliente en producción
- `.env` excluido del repositorio con `.gitignore`

---

## Pruebas realizadas en producción

Todas las pruebas se realizaron contra `https://mongo-la-belle-robe.onrender.com`:

| Prueba | Resultado |
|---|---|
| Registro de usuario | ✅ 201 Created |
| Inicio de sesión con credenciales correctas | ✅ 200 + token |
| Acceso a ruta protegida con token válido | ✅ 200 |
| Acceso sin token | ✅ 401 Unauthorized |
| Acceso con token de cliente a ruta de admin | ✅ 403 Forbidden |
| Creación de producto (admin) | ✅ 201 Created |
| Creación de pedido con validación de stock | ✅ 201 / 400 si sin stock |
| Actualización de estado de pedido | ✅ 200 Updated |
| Pago completado actualiza estado del pedido | ✅ Pedido → Pagado |
| Segundo pago a pedido ya pagado | ✅ 400 rechazado |
| Validación de campos requeridos | ✅ 400 con mensajes claros |

---

## Despliegue

- **Plataforma:** Render (Web Service)
- **Base de datos:** MongoDB Atlas (cluster en la nube)
- **Variables de entorno:** configuradas directamente en Render
- **URL pública:** https://mongo-la-belle-robe.onrender.com
- La API funciona de forma completamente independiente del entorno local

---

## Colección de Postman

Importa el archivo `La_Belle_Robe.postman_collection.json` incluido en el repositorio para probar todos los endpoints con ejemplos preconfigurados.