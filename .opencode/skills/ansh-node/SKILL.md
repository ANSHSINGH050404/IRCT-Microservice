# ansh-node

Use when the user says "use ansh-node style", "generate node boilerplate", "scaffold a node project", "create a new service", or asks to start a new Node.js project following my patterns.

A skill exists to wrangle determinism out of a stochastic system. **Predictability** — the agent taking the same _process_ every run, not producing the same output — is the root virtue; every lever below serves it.

**Bold terms** are defined in [`GLOSSARY.md`](GLOSSARY.md); look them up there for the full meaning.

## Invocation

Two choices, trading different costs:

- A **model-invoked** skill keeps a **description**, so the agent can fire it autonomously _and_ other skills can reach it (you can still type its name too). It contributes to **context load** — the description sits in the window every turn. Mechanics: omit `disable-model-invocation`, and write a model-facing description with rich trigger phrasing ("Use when the user wants…, mentions…").
- A **user-invoked** skill strips the description from the agent's reach: only you, typing its name, can invoke it — and no other skill can. Zero context load, but it spends **cognitive load**: _you_ are the index that must remember it exists. Mechanics: set `disable-model-invocation: true`; the `description` becomes human-facing — a one-line summary, trigger lists stripped.

Pick model-invocation only when the agent must reach the skill on its own, or another skill must. If it only ever fires by hand, make it user-invoked and pay no context load.

When user-invoked skills multiply past what you can remember, that piled-up cognitive load is cured by a **router skill**: one user-invoked skill that names the others and when to reach for each.

## Writing the description

A model-invoked **description** does two jobs — state what the skill is, and list the **branches** that should trigger it. Every word increases **context load**, so a description earns even harder pruning than the body:

- **Front-load the skill's leading word** — the description is where it does its invocation work.
- **One trigger per branch.** Synonyms that rename a single branch are **duplication** — "build features using TDD … asks for test-first development" is one branch written twice. Collapse them; keep only genuinely distinct branches.
- **Cut identity that's already in the body.** Keep the description to triggers, plus any "when another skill needs…" reach clause.

## Information hierarchy

A skill is built from two content types — **steps** and **reference** — that mix freely: a skill can be all steps, all reference, or both. The core decision is which to use and where each sits on the **information hierarchy**, a ladder ranked by how immediately the agent needs the material:

1. **In-skill step** — an ordered action in `SKILL.md`, the primary tier: what the agent does, in order. Each step ends on a **completion criterion**, the condition that tells the agent the work is done. Make it _checkable_ (can the agent tell done from not-done?) and, where it matters, _exhaustive_ ("every modified model accounted for", not "produce a change list") — a vague criterion invites **premature completion**.
2. **In-skill reference** — a definition, rule, or fact in `SKILL.md`, consulted on demand. Often a legitimately flat peer-set (every rule of a review on one rung) — a fine arrangement, not a smell. _This skill is all reference._
3. **External reference** — reference pushed out of `SKILL.md` into a separate file, reached by a **context pointer**, loaded only when the pointer fires. (Spans _disclosed_ reference — a sibling file like `GLOSSARY.md`, still part of the skill — through fully **external reference** that lives outside the skill system and any skill can point at.)

A demanding completion criterion drives thorough **legwork** — the digging the agent does within the work — whether the skill has steps or not, since "every rule applied" binds flat reference just as "every step done" binds a sequence.

Push too little down and the top bloats; push too much and you hide material the agent actually needs. That tension is the whole decision.

**Progressive disclosure** is the move down the ladder — out of `SKILL.md` into a linked file — so the top stays legible. Mechanics: a linked `.md` file in the skill folder, named for what it holds (this skill discloses its full definitions to `GLOSSARY.md`). Some skills are used in more than one way, and each distinct way is a **branch** — different runs taking different paths through the skill. Branching is the cleanest disclosure test: inline what every branch needs, and push behind a pointer what only some branches reach. A **context pointer**'s _wording_, not its target, decides when and how reliably the agent reaches the material.

Where the ladder decides _how far down_ a piece sits, **co-location** decides _what sits beside it_ once there: keep a concept's definition, rules, and caveats under one heading rather than scattered, so reading one part brings its neighbours with it.

## When to split

**Granularity** is how finely you divide skills, and each cut spends one of the two loads, so split only when the cut earns it. Two cuts:

- **By invocation** — split off a **model-invoked** skill when you have a distinct **leading word** that should trigger it on its own, or another skill must reach it. You pay **context load** for the new always-loaded **description**, so that independent reach has to be worth it.
- **By sequence** — split a run of **steps** when the steps still ahead (a step's **post-completion steps**) tempt the agent to rush the one in front of it (**premature completion**). Keeping them out of view encourages the agent to do more **legwork** on the current task.

## Pruning

Keep each meaning in a **single source of truth**: one authoritative place, so changing the behaviour is a one-place edit.

Check every line for **relevance**: does it still bear on what the skill does?

Then hunt **no-ops** sentence by sentence, not just line by line: run the no-op test on each sentence in isolation, and when one fails, delete the whole sentence rather than trim words from it. Be aggressive — most prose that fails should go, not be rewritten.

## Leading words

A **leading word** is a compact concept already living in the model's pretraining that the agent thinks with while running the skill (e.g. _lesson_, _fog of war_, _tracer bullets_). Repeated throughout the text (though not necessarily - a strong leading word might only be needed once), it accumulates a distributed definition and anchors a whole region of behaviour in the fewest tokens, by recruiting priors the model already holds.

It serves predictability twice. In the body it anchors _execution_: the agent reaches for the same behaviour every time the word appears. In the description it anchors _invocation_: when the same word lives in your prompts, docs, and code, the agent links that shared language to the skill and fires it more reliably.

Hunt for opportunities to refactor skills to use leading words. A triad spelled out at three sites (**duplication**), a description spending a sentence to gesture at one idea — each is a passage begging to **collapse** into a single token. Examples include:

- "fast, deterministic, low-overhead" -> _tight_ — one quality restated across a phase — into a single pretrained word (a _tight_ loop).
- "a loop you believe in" -> _red_ — converts a fuzzy gate into a binary observable state (the loop goes _red_ on the bug, or it doesn't).

You win twice over: fewer tokens, _and_ a sharper hook for the agent to hang its thinking on. Assume every skill is carrying restatements that leading words retire — go find them.

## Failure modes

Use these to diagnose issues the user may be having with the skill.

- **Premature completion** — ending a step before it's genuinely done, attention slipping to _being done_. Defence, in order: sharpen the completion criterion first (cheap, local); only if it is irreducibly fuzzy _and_ you observe the rush, hide the post-completion steps by splitting (the sequence cut).
- **Duplication** — the same meaning in more than one place. Costs maintenance and tokens, and inflates a meaning's prominence on the ladder past its real rank.
- **Sediment** — stale layers that settle because adding feels safe and removing feels risky. The default fate of any skill without a pruning discipline.
- **Sprawl** — a skill simply too long, even when every line is live and unique. Hurts readability and maintainability and wastes tokens. The cure is the ladder: disclose **reference** behind pointers, and split by **branch** or sequence so each path carries only what it needs.
- **No-op** — a line the model already obeys by default, so you pay load to say nothing. The test: does it change behaviour versus the default? A weak leading word (_be thorough_ when the agent is already thorough-ish) is a no-op; the fix is a stronger word (_relentless_), not a different technique.

---

## Boilerplate: Node.js service (Express + Bun + Prisma v7)

When scaffolding a new Node.js service, generate this structure and code.

### Project structure

```
.env
package.json
tsconfig.json
db.ts
prisma/
  schema.prisma
  migrations/
prisma.config.ts
docker-compose.yml
src/
  server.ts
  app.ts
  config/
    index.ts
    logger.ts
    redis.ts
  middlewares/
    error.middleware.ts
    req.middleware.ts
  utils/
    error.ts
  routes/
  controllers/
  services/
  types/
```

### Files

#### `package.json`
```json
{
  "name": "<service-name>",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "bun --watch src/server.ts",
    "start": "NODE_ENV=production bun src/server.ts"
  },
  "dependencies": {
    "@prisma/adapter-pg": "^7",
    "cookie-parser": "^1",
    "cors": "^2",
    "dotenv": "^17",
    "express": "^5",
    "helmet": "^8",
    "ioredis": "^5",
    "pg": "^8"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "@types/cors": "^2",
    "@types/express": "^5",
    "@types/pg": "^8",
    "prisma": "^7",
    "typescript": "^5"
  }
}
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleDetection": "force",
    "allowJs": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noPropertyAccessFromIndexSignature": false
  }
}
```

#### `.env`
```env
PORT="4001"
DATABASE_URL="postgres://postgres:postgres@localhost:5432/<db-name>"
REDIS_URL="redis://default@localhost:6379"
```

#### `prisma.config.ts`
```ts
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

#### `prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

#### `db.ts`
```ts
import "dotenv/config";
import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
});
```

#### `docker-compose.yml`
```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: <project>-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: <db-name>
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: <project>-redis
    restart: always
    ports:
      - "6379:6379"

  redis-ui:
    image: redis/redisinsight:latest
    container_name: <project>-redis-ui
    restart: always
    ports:
      - "5540:5540"
    depends_on:
      - redis

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: <project>-pgadmin
    restart: always
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

#### `src/server.ts`
```ts
import app from './app';
import { config } from './config';

const server = app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port} [${config.nodeEnv}]`);
});

function gracefulShutdown() {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
```

#### `src/app.ts`
```ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { requestLogger } from './middlewares/req.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requestLogger);

app.get('/', (_req, res) => {
  res.json({ success: true, message: '<service-name> is running' });
});

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Health check OK' });
});

app.use(errorHandler);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export default app;
```

#### `src/config/index.ts`
```ts
import 'dotenv/config';

export const config = {
  port: parseInt(process.env.PORT ?? '4001', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  cors: {
    origin: process.env.CORS_ORIGIN ?? '*',
  },
  redisUrl: process.env.REDIS_URL ?? 'redis://localhost:6379',
  get isDevelopment() {
    return this.nodeEnv === 'development';
  },
  get isProduction() {
    return this.nodeEnv === 'production';
  },
};
```

#### `src/config/logger.ts`
```ts
export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.log(`[INFO] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]) => {
    console.debug(`[DEBUG] ${message}`, ...args);
  },
};
```

#### `src/config/redis.ts`
```ts
import Redis from 'ioredis';
import { logger } from './logger';
import { config } from './index';

class RedisClient {
  static instance: Redis;
  static isConnected = false;

  static getInstance() {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(config.redisUrl, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });
      RedisClient.isConnected = true;
    }
    return RedisClient.instance;
  }
}

export default RedisClient;
```

#### `src/middlewares/req.middleware.ts`
```ts
import type { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
}
```

#### `src/middlewares/error.middleware.ts`
```ts
import type { NextFunction, Request, Response } from 'express';
import AppError from '../utils/error';

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message,
    statusCode,
    code: err.code || 'INTERNAL_ERROR',
  });
};
```

#### `src/utils/error.ts`
```ts
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, 'BAD_REQUEST');
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
  }
}

class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403, 'FORBIDDEN');
  }
}

export default AppError;
export { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError };
```

### Convention: route-controller-service pattern

- **Routes** (`src/routes/`) — define HTTP methods and wire to controllers. No logic.
- **Controllers** (`src/controllers/`) — parse/extract from request, call service, format response. Use `try/catch` and pass errors to `next()`.
- **Services** (`src/services/`) — business logic, database calls via `prisma`. Throw `AppError` subclasses on failure.
- **Types** (`src/types/`) — shared TypeScript interfaces and types.
- **Utils** (`src/utils/`) — pure helper functions and the `AppError` hierarchy.

### Convention: response shape

All API responses follow:

```ts
// Success
{ success: true, data: T, message?: string }

// Error
{ success: false, error: string, statusCode: number, code: string }
```

### Steps

1. Create project directory and initialize with `bun init`.
2. Write `package.json` with dependencies above.
3. Write `tsconfig.json`.
4. Write `.env`.
5. Write `prisma.config.ts` and `prisma/schema.prisma`.
6. Write `docker-compose.yml`.
7. Write `db.ts`.
8. Scaffold `src/` directory structure.
9. Write `src/config/index.ts`, `src/config/logger.ts`, `src/config/redis.ts`.
10. Write `src/utils/error.ts`.
11. Write `src/middlewares/req.middleware.ts`, `src/middlewares/error.middleware.ts`.
12. Write `src/app.ts`.
13. Write `src/server.ts`.
14. Run `bun install`.
15. Run `bun --bun run prisma generate`.
16. Create initial migration: `bun --bun run prisma migrate dev --name init`.
17. Verify app starts: `bun run dev`.
