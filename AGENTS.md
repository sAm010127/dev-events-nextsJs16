<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project conventions for agents
- Stack: Next.js 16.2.7 + React 19.2 + TypeScript (`strict: true`).
- Routing is App Router only (`app/` directory).
- Styling uses Tailwind CSS v4 in `app/globals.css` (`@theme`, `@utility`, `@layer` patterns already established).
- Prefer imports via `@/*` alias instead of deep relative paths.

## Validation workflow
- Use `npm` (this repo is locked with `package-lock.json`).
- Run `npm run lint` after changes.
- Run `npm run build` for framework/config/route changes or any non-trivial refactor.
- There is no dedicated test script yet; do not claim tests were run unless you add and execute them.

## Editing guardrails
- Keep components as Server Components by default; add `"use client"` only when hooks/browser APIs are required.
- Use `next/link` for internal navigation and `next/image` for static assets in `public/`.
- Preserve existing theme tokens and utility patterns in `app/globals.css` when extending styles.
- Before using unfamiliar Next.js APIs, check the relevant docs in `node_modules/next/dist/docs/` and apply deprecation guidance.
