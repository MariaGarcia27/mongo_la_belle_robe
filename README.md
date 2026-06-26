# La Belle Robe API

API REST para la tienda de ropa en línea **La Belle Robe**, desarrollada como parcial práctico de Desarrollo de Software IX.

## Tecnologías
- Node.js + Express
- MongoDB con Mongoose
- JWT (jsonwebtoken) + bcryptjs
- Docker (MongoDB local)
- Desplegado en Railway

## Instalación local
```bash
git clone https://github.com/MariaGarcia27/mongo_la_belle_robe.git
cd mongo_la_belle_robe
pnpm install
```


## Levantar Docker y correr el proyecto
```bash
docker-compose up -d
pnpm dev
```

## Correr el seed
```bash
pnpm seed
```

## Credenciales de prueba
| Rol     | Correo                  | Contraseña |
|---------|-------------------------|------------|
| Admin   | admin@labellerobe.com   | admin123   |
| Cliente | cliente@labellerobe.com | cliente123 |

## Endpoints
### Auth
| Método | Ruta                | Acceso      |
|--------|---------------------|-------------|
| POST   | /api/auth/register  | Público     |
| POST   | /api/auth/login     | Público     |
| GET    | /api/auth/profile   | Autenticado |
| GET    | /api/auth/usuarios  | Admin       |

### Productos
| Método | Ruta               | Acceso      |
|--------|--------------------|-------------|
| GET    | /api/productos     | Público     |
| GET    | /api/productos/:id | Público     |
| POST   | /api/productos     | Admin       |
| PUT    | /api/productos/:id | Admin       |
| DELETE | /api/productos/:id | Admin       |

### Pedidos
| Método | Ruta                      | Acceso      |
|--------|---------------------------|-------------|
| POST   | /api/pedidos              | Autenticado |
| GET    | /api/pedidos              | Admin       |
| GET    | /api/pedidos/mis-pedidos  | Autenticado |
| PUT    | /api/pedidos/:id/estado   | Admin       |

### Pagos
| Método | Ruta                 | Acceso      |
|--------|----------------------|-------------|
| POST   | /api/pagos           | Autenticado |
| GET    | /api/pagos           | Admin       |
| GET    | /api/pagos/mis-pagos | Autenticado |

## Roles y permisos
- **cliente**: ver catálogo, crear pedidos, ver sus pedidos y pagos, ver su perfil
- **admin**: todo lo anterior + crear/editar/eliminar productos, ver todos los pedidos y pagos, actualizar estado de pedidos, ver lista de usuarios



## Health Check
```
GET /api/health
```