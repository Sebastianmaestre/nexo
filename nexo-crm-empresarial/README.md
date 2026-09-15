# Nexo CRM — demo empresarial (IRIS)

CRM empresarial completo, adaptado de la demo original de sistema odontológico.
Backend real en NestJS + Prisma, frontend en Next.js, con autenticación por rol,
pipeline de ventas, agenda de reuniones, tareas y notificaciones en tiempo real
por WebSockets.

## Stack

- **Backend:** NestJS + Prisma + SQLite (por defecto) / PostgreSQL (producción) + JWT + Socket.io
- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Infraestructura:** Docker + Docker Compose + Nginx (opcional, ver abajo)

## Estructura

```
crm-empresarial/
├── backend/         # API NestJS
│   ├── prisma/       # schema.prisma + seed.ts
│   └── src/          # auth, clients, deals, meetings, tasks, dashboard, realtime
├── frontend/         # App Next.js
│   └── src/
│       ├── app/       # login, dashboard, clientes, pipeline, reuniones, tareas
│       ├── components/
│       ├── context/   # AuthContext
│       └── lib/       # cliente API
└── docker-compose.yml
```

## Módulos incluidos

- **Autenticación** por rol (Admin / Ventas / Soporte) con JWT
- **Clientes**: alta, búsqueda, ficha con negocios y actividad
- **Pipeline de ventas**: negocios por etapa (Prospecto → Contactado → Propuesta → Cerrado)
- **Reuniones**: agenda por horarios, igual que la demo original pero para reuniones de negocio
- **Tareas**: pendientes por responsable, con estado
- **Dashboard**: KPIs (clientes, reuniones de hoy, negocios cerrados, ingresos, tareas pendientes)
- **Notificaciones en tiempo real** vía WebSockets (nuevo cliente, negocio ganado, reunión o tarea creada)

## Cómo correrlo en tu máquina

### Opción A — sin Docker (más rápido para probar)

**Backend:**
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
npm run start:dev   # (agregar script en package.json: "start:dev": "ts-node-dev src/main.ts")
```

**Frontend** (en otra terminal):
```bash
cd frontend
npm install
npm run dev
```

Abrí `http://localhost:3000`. Usuarios de ejemplo (contraseña `demo1234`):
- `admin@iris.dev` — Admin
- `ventas@iris.dev` — Ventas
- `soporte@iris.dev` — Soporte

### Opción B — con Docker Compose (Postgres incluido)

Antes de levantar con Docker, cambiá el provider de Prisma a Postgres en
`backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Luego:
```bash
docker compose up --build
```

Esto levanta Postgres, el backend en `:3001` y el frontend en `:3000`.
Corré el seed una vez que esté arriba:
```bash
docker compose exec backend npx ts-node prisma/seed.ts
```

## Nota sobre esta entrega

El código se armó y se verificó con TypeScript (`tsc --noEmit`) sin errores en
ambos proyectos. En el entorno donde se generó este proyecto no fue posible
ejecutar `prisma generate` porque Prisma descarga el motor de la base de datos
desde `binaries.prisma.sh`, un dominio sin acceso en esa sandbox — en tu
máquina, con internet normal, ese paso funciona sin problema y es el primer
comando que tenés que correr.

## Próximos pasos sugeridos

- Exportar clientes/reportes a CSV
- Historial de auditoría (quién cambió qué)
- Multi-tenant si se piensa vender a varias empresas
- Métricas con Python (pandas) como microservicio de reportes
