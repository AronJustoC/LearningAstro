# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Existing: Astro 5 (SSR, node adapter) + React 19 islands + Tailwind 4 + shadcn/ui (Base UI). Backend API in ../backen-ts-portfolio via API_BASE_URL.

## Users

Primary: companies and clients who hire a developer for infrastructure, workflow automation and AI-agent projects. They land from a link or search, skim for proof of real shipped work, and decide whether to make contact. Secondary (unconfirmed weight): recruiters.

## Product Purpose

Personal portfolio of Aron Choque (developer, Cusco, Peru). Shows shipped projects, the working stack, and a blog, and converts a visit into a direct contact. Success = a qualified client writes to him.

## Positioning

A solo developer who combines infrastructure and automation rigor with AI-agent workflows (agents, MCP, Claude Code) and ships production sites. Differentiator is the engineering depth shown through real projects, not a generic "full stack" claim.

## Operating Context

Public pages: home (hero, stack, projects, posts), /proyectos, /blog, /contacto. Private admin (posts, projects, dashboard) behind login. Content (projects, posts) comes from the backend API; contact is a mailto flow. Language: Spanish. Light and dark themes.

## Capabilities and Constraints

- Projects and posts are fetched server-side; the backend can be down, so every list needs loading/empty/error states.
- Contact opens the visitor's mail client (no server form).
- Official contact (confirmed by owner): email aronchoque727@gmail.com, WhatsApp +51 983731782. Single source: src/lib/contact.ts. Business intent: software solutions for clients, companies and service businesses.
- Logo: "AJ" monogram, blue #12B0FF, assets in public/brand/ (source: ADNsociales/video-pipeline/assets/brand/logo_pro/codex/concepto1). Brand name confirmed by owner: surname Choque; header shows "Aron J. Choque". The "AJ" monogram, GitHub handle and domain (aronjusto.site) are legacy and kept as is.

## Brand Commitments

Keep the existing cyan/slate palette (cyan #22d3ee / #0e7490 on slate #0f172a) and the minimalist essence: generous whitespace, clear hierarchy, nothing decorative for its own sake. Owner explicitly asked for a more professional, software-company look, with the structure of a chosen Impeccable gallery model (perpetual-exchange "Slipstream": status strip, big condensed headline, terminal-style data panel, table-like rows, mono labels) adapted to this palette and to a closer-to-the-model intensity.

## Evidence on Hand

Three project screenshots in public/projects/ (avanzik, hadbusiness, mbcpredictive). One blog post (src/content/blog/mi-primer-post.md). No testimonials, client logos, metrics or pricing exist: do not fabricate them.

## Product Principles

1. Proof before promise: real projects lead, claims stay factual.
2. One primary action per view: contact.
3. Every data-driven block has loading, empty and error states.
4. Professional through precision (alignment, type, contrast), not through effects.

## Accessibility & Inclusion

Target WCAG 2.2 AA in light and dark; respect prefers-reduced-motion; visible keyboard focus.
