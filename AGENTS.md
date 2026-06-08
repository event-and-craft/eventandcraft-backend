# EventCraft Backend

## Stack

- **Framework:** NestJS 11 + TypeScript (NodeNext module resolution)
- **ORM:** Sequelize 6 with `sequelize-typescript` against PostgreSQL (Neon)
- **Auth:** JWT (NestJS @nestjs/jwt) + Firebase Admin SDK
- **File storage:** Firebase Storage (via `FirebaseStorageService`, exported as `FileStorageService`)
- **Mail:** `@nestjs-modules/mailer` with Nodemailer + Handlebars templates
- **Swagger:** `@nestjs/swagger` at `/doc` (configurable via `SWAGGER_DOC_URL` env)
- **Admin SPA:** Separate Vite + React app in `admin/`, served as static assets under `/admin`

## Project structure

```
src/
├── main.ts              # Entrypoint: global prefix `/api`, CORS *, Swagger
├── app.module.ts        # Root module wiring all feature modules
├── common/
│   ├── decorators/      # @User() param decorator
│   ├── filters/         # GlobalExceptionFilter
│   ├── guards/          # AuthGuard (JWT), JwtAuthGuard (legacy JWT verify), AdminGuard (admin verification)
│   ├── models/          # BaseModel (UUID PK, timestamps, soft-delete)
│   └── utils/
├── config/              # NestJS config namespaces: database, firebase
├── database/            # Sequelize root module (dialect: postgres, ssl: true)
└── modules/
    ├── auth/            # Google signup, phone signup, admin login, token refresh
    ├── users/           # CRUD (User model with firebaseUid, refreshToken)
    ├── posts/           # CRUD + status transitions (draft/published)
    ├── categories/
    ├── reviews/
    ├── social/
    ├── storage/         # Proxy → FirebaseStorageService
    ├── firebase/        # Firebase Admin init (auth, firestore, storage)
    ├── mailer/          # Send email via POST /api/mailer/ping
    └── admin-dashboard/ # (empty, reserved)
```

## Commands

```sh
pnpm install              # Install deps
pnpm run build            # nest build → dist/
pnpm run start:dev        # nest start --watch (dev server)
pnpm run start:prod       # node dist/main
pnpm run lint             # eslint --fix
pnpm run format           # prettier --write
pnpm run test             # jest (rootDir: src, pattern: *.spec.ts)
pnpm run test:e2e         # jest --config ./test/jest-e2e.json (rootDir: test)
pnpm run test:cov         # jest --coverage
```

## Key conventions

### Models
- The database schema represents the relational entities of the platform (users, creator profiles, service catalogue, posts, categories, etc.). See [SCHEMA.md](file:///home/ajn-ash/Documents/projects/eventandcraft/eventandcraft-backend/SCHEMA.md) for the detailed schema specification and Entity-Relationship (ER) diagram.
- All models extend `BaseModel` (UUID primary key, `timestamps: true`, `paranoid: true` for soft-delete).
- Table naming uses `underscored: true` (snake_case columns).
- DB sync is `synchronize: true` — safe for dev, do **not** enable in production.
- SSL is **always** enabled (`rejectUnauthorized: false`), matching Neon's requirements.

### Auth
- Three guards exist: `AuthGuard` (manually verifies JWT for general users), `JwtAuthGuard` (legacy manual JWT verification, used in `UsersController`), and `AdminGuard` (verifies admin privileges). Prefer `AuthGuard` for new user endpoints.
- Token expected as `Bearer <token>` in the `Authorization` header.
- Use `@User()` decorator on controller params to extract `req.user`.
- JWT secret comes from env `JWT_ACCESS_TOKEN_SECRET_KEY` (required for app to start).
- Firebase credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) needed for Firebase Auth + Storage.

### API
- All routes under `/api` prefix (set in `main.ts`).
- CORS allows `*` origins.
- Global exception filter returns `{ statusCode, status: false, timestamp, message }`.
- `BaseModel` models use UUID primary keys (`id`) — strings everywhere, not numbers.
- Use `@nestjs/swagger` decorators (`@ApiTags`, `@ApiBearerAuth`, `@ApiOperation`, `@ApiQuery`) on controllers for Swagger doc generation.

### Admin SPA (`admin/`)
- Separate project with its own `package.json`, `vite.config.ts`, `tsconfig.json`.
- Built output goes to `admin/dist/`, served statically by the Nest app at `/admin`.
- SPA fallback routes handled by `AppController.getAdminFallback()`.
- Uses shadcn-admin-kit + ra-core. Requires `verbatimModuleSyntax: false` in admin's tsconfig.
- When making changes, build with `pnpm run build` inside `admin/`.

### Database
- Config namespace: `database` (host, port, username, password, database — mapped from `DB_*` env vars).
- Config namespace: `firebase` (projectId, privateKey, clientEmail, storageBucket — mapped from `FIREBASE_*` env vars).
- `.env` file must be present at repo root (gitignored; copy from `.env.sample`).

## Operational notes

- `dotenv.config()` is called in `main.ts` before `NestFactory.create` — some external modules depend on env vars being loaded early.
- The `MailerModule` is `@Global()` — its `MailerService` can be injected anywhere without re-importing.
- The `FirebaseModule` and `StorageModule` are also `@Global()`.
- `ScheduleModule.forRoot()` is enabled — use `@Cron` / `@Interval` for scheduled jobs.
- Admin SPA is excluded from the root `tsconfig.json` via `"exclude": ["admin"]`.
- `dist/` is the compiled NestJS output; `admin/dist/` is the admin SPA output.
