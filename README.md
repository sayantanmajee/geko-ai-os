geko-ai/
├── infra/                          # 🐳 Docker & Infrastructure
│   ├── docker-compose.yml          # Runs Postgres, Redis, LibreChat
│   ├── postgres/                   # Init scripts & schemas
│   └── librechat/                  # LibreChat config (librechat.yaml)
│
├── apps/                           # 🖥️ Client Applications
│   ├── electron/                   # The Main Desktop App
│   │   ├── src/
│   │   │   ├── main/               # Electron Main Process (Node.js) -> Handles Local LLM/MCP
│   │   │   ├── preload/            # Bridge between Main & Renderer
│   │   │   └── renderer/           # React App (The UI)
│   │   ├── package.json
│   │   └── electron-builder.yml
│   │
│   └── mobile/                     # React Native / Expo (Future)
│       ├── app/
│       └── package.json
│
├── services/                       # 🛡️ Backend Services
│   └── gateway/                    # The Modular Monolith
│       ├── src/
│       │   ├── app.ts
│       │   └── modules/            # (Auth, Billing, Workspace, AI-Proxy)
│       ├── package.json
│       └── Dockerfile
│
├── packages/                       # 📦 Shared Libraries
│   ├── types/                      # Shared TS Interfaces & Zod Schemas
│   │   ├── src/
│   │   │   ├── user.ts
│   │   │   └── workspace.ts
│   │   └── package.json
│   │
│   ├── ui/                         # Shared Design System (shadcn/ui + Tailwind)
│   │   ├── components/             # Button, Input, Modal
│   │   └── package.json
│   │
│   ├── config/                     # Shared Tooling
│   │   ├── eslint-preset.js
│   │   └── tsconfig.base.json
│   │
│   └── sdk/                        # Optional: Your own API Client wrapper
│       └── package.json            # "import { GekoClient } from '@geko/sdk'"
│
├── package.json                    # Root scripts ("dev": "turbo run dev")
├── pnpm-workspace.yaml             # Defines the monorepo members
└── turbo.json                      # Turbo pipeline config