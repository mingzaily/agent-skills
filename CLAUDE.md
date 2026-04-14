# agent-skills 项目说明

## 仓库用途

本仓库是一个 [skills.sh](https://skills.sh) 规范的 Skill 合集，提供可复用的 AI Agent 专项能力包。

安装命令：

```bash
npx skills add mingzaily/agent-skills
npx skills add mingzaily/agent-skills/release-planner
```

## 目录结构

```
agent-skills/
├── CLAUDE.md
├── AGENTS.md
├── README.md
└── skills/
    └── <skill-name>/
        ├── SKILL.md          # 必须：skill 主文件，含 YAML frontmatter
        ├── references/       # 可选：详细参考文档，按需加载
        ├── examples/         # 可选：可直接复用的示例文件
        └── scripts/          # 可选：可执行的工具脚本
```

## Skill 开发规范

### SKILL.md Frontmatter

```yaml
---
name: skill-name              # 必须，小写 + 连字符
description: >                # 必须，第三人称，含具体触发短语
  This skill should be used when the user asks to "..."
license: MIT
metadata:
  author: mingzaily
  version: "1.0.0"
---
```

### 写作风格

- 正文使用 **imperative 形式**（动词开头），不用第二人称
- SKILL.md 保持精简（1500–2000 词），详细内容移至 `references/`
- 末尾用 `## Additional Resources` 列出所有依赖文件

### 目录职责

| 目录 | 用途 | 加载时机 |
|------|------|----------|
| `SKILL.md` | 核心流程与概念 | skill 触发时自动加载 |
| `references/` | 详细规范、API 文档、模板 | Claude 判断需要时加载 |
| `examples/` | 完整可运行的示例 | 按需引用 |
| `scripts/` | 工具脚本（Python/Bash） | 执行时读取 |

### 新增 Skill 检查清单

- [ ] `SKILL.md` 含 `name`、`description`、`license`、`metadata`
- [ ] description 使用第三人称，含具体触发短语
- [ ] 正文为 imperative 形式，无 "you should" 等第二人称
- [ ] SKILL.md 体积精简，细节在 `references/`
- [ ] `examples/` 中仅使用虚构数据，不含真实业务信息
- [ ] `SKILL.md` 末尾的 `Additional Resources` 列出所有依赖文件
