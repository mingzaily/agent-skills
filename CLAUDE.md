# Project Instructions

This repository contains reusable AI agent skills following the [skills.sh](https://skills.sh) standard.

## Installation

```bash
npx skills add mingzaily/agent-skills
npx skills add mingzaily/agent-skills/release-planner
```

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

```yaml
---
name: skill-name              # required, lowercase + hyphens
description: >                # required, third-person with concrete trigger phrases
  This skill should be used when the user asks to "..."
license: MIT
metadata:
  author: mingzaily
  version: "1.0.0"
---
```

### Writing Style

- Use **imperative/infinitive form** throughout the body (verb-first instructions)
- Never use second person ("you should", "you need to")
- Keep SKILL.md body under 2000 words; move detail to `references/`
- End with `## Additional Resources` listing all referenced files

### Directory Responsibilities

| Directory | Purpose | Loaded |
|-----------|---------|--------|
| `SKILL.md` | Core concepts and workflow | When skill triggers |
| `references/` | Detailed specs, API docs, templates | On demand by agent |
| `examples/` | Complete, runnable examples | Referenced as needed |
| `scripts/` | Utility scripts (Python/Bash) | On execution |

### Checklist for New Skills

- [ ] `SKILL.md` has `name`, `description`, `license`, `metadata`
- [ ] `description` uses third person with specific trigger phrases
- [ ] Body uses imperative form, no second-person language
- [ ] `SKILL.md` is lean; detail lives in `references/`
- [ ] `examples/` contains fictional data only — no real names or business data
- [ ] `## Additional Resources` in `SKILL.md` lists all dependency files
