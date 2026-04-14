# Agent Instructions

This repository contains reusable AI agent skills following the [skills.sh](https://skills.sh) standard.

## Repository Layout

```
agent-skills/
├── CLAUDE.md / AGENTS.md     # Project instructions for AI agents
├── README.md                 # User-facing documentation
└── skills/
    └── <skill-name>/
        ├── SKILL.md          # Required: skill entry point with YAML frontmatter
        ├── references/       # Optional: detailed docs loaded on demand
        ├── examples/         # Optional: working examples with fictional data only
        └── scripts/          # Optional: executable utility scripts
```

## Skill Authoring Rules

### SKILL.md Frontmatter

Every skill must have a `SKILL.md` with valid YAML frontmatter:

```yaml
---
name: skill-name
description: >
  This skill should be used when the user asks to "specific phrase 1",
  "specific phrase 2", or provides <data type> for <task>.
license: MIT
metadata:
  author: mingzaily
  version: "1.0.0"
---
```

- `name`: lowercase, hyphens only
- `description`: third-person, include concrete trigger phrases users would say
- All four fields (`name`, `description`, `license`, `metadata`) are required

### Writing Style

- Use **imperative/infinitive form** throughout the body (verb-first, e.g. "Extract the version number")
- Never use second person ("you should", "you need to", "你应该")
- Keep SKILL.md body under 2000 words; move detail to `references/`

### Data Policy

- `examples/` must contain **fictional data only** — no real names, real versions, or real business information
- `references/` may contain real templates and schemas, but no personally identifiable project data

### Adding a New Skill

1. Create `skills/<name>/SKILL.md` with required frontmatter
2. Add `references/` for detailed specs and templates
3. Add `examples/` with fictional-data demos
4. Update root `README.md` skill table
5. Verify all trigger phrases in `description` are specific and actionable
