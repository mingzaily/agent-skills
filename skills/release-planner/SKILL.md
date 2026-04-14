---
name: release-planner
description: >-
  This skill should be used when the user asks to "帮我生成排期", "做一个甘特图",
  "出一下排期", "生成 v{x.x.x} 排期", "生成开发排期", or provides version number,
  team members, timeline, and start date information for sprint planning.
  Generates two files: a structured schedule document (开发排期甘特图.md) and
  an interactive Gantt chart (开发排期甘特图.html).
license: MIT
metadata:
  author: mingzaily
  version: "1.0.0"
---

# Release Planner

Generate a version release schedule and interactive Gantt chart from natural language sprint planning input. Produce two deliverable files:

- `开发排期甘特图.md` — structured schedule document (key milestones + resource breakdown table)
- `开发排期甘特图.html` — interactive Gantt chart (today highlight, tooltips, dashed bridges, milestone diamond)

## Trigger Conditions

Activate when the user provides any of the following:

- Keywords: "帮我生成排期"、"做一个甘特图"、"出一下排期"、"生成开发排期"、"生成 v{x.x.x} 排期"
- Data: version number + team members + duration estimates + start date

## Workflow

### Step 1 — Collect Information

Extract the following from user input:

| Field | Example |
|---|---|
| Version number | v2.3.0 |
| Planned start date | 2025-06-02 (Monday) |
| Team members + duration (grouped by backend / frontend / client) | alice 5d, bob 4d |
| Individual leave dates | bob 6/4–6/5 on leave |
| Public holidays & substitution workdays | Dragon Boat 5/31–6/2, makeup 5/25 |
| Joint debugging phases | Phase①: 3d, Phase②: 2d |
| Test phase arrangement | QA env 5d → Pre-prod 3d → Product review 2d |
| Target release date | next Monday after pre-prod ends |

If any required field is missing, ask the user before proceeding.

### Step 2 — Calculate Dates

Apply the following rules (see `references/scheduling-rules.md` for full details):

- Skip weekends (dow 0/6)
- Skip public holidays (`holiday: true`); substitute workdays are treated as normal workdays
- Mark personal leave as `bar-leave` (red bar), overlaid on the dev bar
- Start joint debugging after the longest dev track completes
- Start QA env testing the next workday after joint debugging ends
- Run product review in parallel with pre-prod testing
- Set release milestone to the next Monday after pre-prod ends

### Step 3 — Generate Output Files

Produce both files strictly following the templates below.

---

## Output: 开发排期甘特图.md

```markdown
# {版本号} 版本开发排期

## 文档信息

| 项目         | 内容                       |
| ------------ | -------------------------- |
| 版本         | {版本号}                   |
| 计划开始时间 | {开始日期}                 |
| 工作日规则   | 双休，周六周日不排期        |
| 排期输出日期 | {今日日期}                 |
| 预计版本发布 | {发版日期}                 |
| 特殊说明     | {请假说明}；{假期说明}     |

---

## 排期计划

### 关键节点

| 节点 | 日期 | 说明 |
| ---- | ---- | ---- |
| ...  | ...  | ...  |

### 研发资源排期明细

| 人员 | 工作内容 | 工期 | 排期 | 备注 |
| ---- | -------- | ---: | ---- | ---- |
| ...  | ...      | ...  | ...  | ...  |
```

---

## Output: 开发排期甘特图.html

Use the full HTML template in `references/gantt-template.md`. Modify **only** the data section:

- `<title>` and `<h1>` — version number
- `.subtitle` — schedule output date
- `.info-table` — planned start, estimated release, special notes
- `<p class="note">` — free-text annotation
- `const DAYS = [...]` — date array from start date to release date + 1 buffer column
- `const ROWS = [...]` — personnel and phase data

**Do not modify CSS, HTML structure, or JS rendering logic.**

---

## DAYS Array Quick Reference

```js
// Each entry:
{ date: "MM/DD", dow: 0-6, holiday: true/false }
// dow: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
// holiday: true for statutory holidays only; weekends are identified by dow
// Substitute workdays (weekend makeup days): keep correct dow, holiday: false
// Add one buffer column after the release date
```

## ROWS Array Quick Reference

```js
// Group header:
{ group: "后端开发", color: "blue" }
// color options: blue / green / orange / purple / pink / gray

// Person row:
{ label: "alice", bars: [{ label, cls, start, end, tooltip }] }
// Pure English labels render as <code> tags automatically

// Bar types (cls):
// bar-dev    → blue   (#4f86f7)  Development
// bar-leave  → red    (#f87171)  Personal leave
// bar-joint  → green  (#34c97e)  Joint debugging
// bar-test   → orange (#f6a623)  QA env testing
// bar-pre    → purple (#a855f7)  Pre-prod testing
// bar-review → pink   (#ec4899)  Product review

// Milestone row:
{ label: "版本发布", milestone: "MM/DD", milestoneTooltip: "..." }
```

---

## Additional Resources

| File | Purpose |
|------|---------|
| `references/gantt-template.md` | Complete HTML template + DAYS/ROWS data specification |
| `references/scheduling-rules.md` | Date calculation rules, standard phase durations, leave handling |
| `examples/v1.0.0-schedule.md` | Example schedule document (fictional team data) |
| `examples/v1.0.0-schedule.html` | Example interactive Gantt chart (fictional team data) |
