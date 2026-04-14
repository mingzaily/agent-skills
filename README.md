# agent-skills

可复用的 AI Agent Skill 合集。一条命令安装，即刻增强你的 AI 助手能力。

## 安装

```bash
# 安装全部 skills
npx skills add mingzaily/agent-skills

# 安装指定 skill
npx skills add mingzaily/agent-skills/release-planner
```

## Skill 列表

| Skill | 描述 | 安装命令 |
|-------|------|----------|
| [release-planner](./skills/release-planner) | 开发排期规划 — 根据自然语言描述生成排期文档和可交互甘特图 | `npx skills add mingzaily/agent-skills/release-planner` |

## 兼容的 AI Agent

- Claude Code
- Cursor
- Cline
- Windsurf
- GitHub Copilot

## 使用方式

安装 skill 后，直接用自然语言触发：

```
帮我生成 v2.0.0 排期，后端 alice/bob/carol，前端 dave/eve，
6月2日开始，预计4周，端午假期6月19–21日，bob 6月5–6日请假
```

Claude 会自动生成 `开发排期甘特图.md` 和 `开发排期甘特图.html` 两个文件。

## License

MIT
