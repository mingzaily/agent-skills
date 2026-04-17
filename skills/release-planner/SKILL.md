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
  version: "1.1.0"
---

# Release Planner

Generate a version release schedule and interactive Gantt chart from natural language sprint planning input. Produce two deliverable files:

- `开发排期甘特图.md` — structured schedule document (key milestones + resource breakdown table)
- `开发排期甘特图.html` — interactive Gantt chart (today highlight, header tooltips, seamless bar continuity, dashed bridges, overtime pending boxes, row hover, auto-scroll to today, milestone diamond)

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
| Overtime status (confirmed / pending / none) | 04/25 周六加班待定 |
| Joint debugging phases | Phase①: 3d, Phase②: 2d |
| Test phase arrangement | QA env 5d → Pre-prod 3d → Product review 2d |
| Target release date | user-confirmed date after pre-prod ends |

If any required field is missing, ask the user before proceeding.

### Step 2 — Calculate Dates

Apply the following rules (see `references/scheduling-rules.md` for full details):

- Skip weekends (dow 0/6) unless `workday: true`
- Skip public holidays (`holiday: true`); substitute workdays (`workday: true`) are treated as normal workdays
- Overtime pending days (`overtimePending: true`) remain off days for counting — rendered as dashed boxes
- Mark personal leave as `bar-leave` (red bar), overlaid on the dev bar
- Start joint debugging after the longest dev track completes
- Start QA env testing the next workday after joint debugging ends
- Run product review in parallel with pre-prod testing
- Confirm release date with user; any workday after pre-prod ends is acceptable

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

Use the HTML skeleton in `references/gantt-template.md`. CSS and JS are shared assets in `scripts/`:

- **CSS**: `scripts/gantt.css` — load via CDN `<link>` or inline into `<style>`
- **JS**: `scripts/gantt.js` — load via CDN `<script>` or inline into `<script>` (must come AFTER the data `<script>`)

Only fill in the data section:

- `<title>` and `<h1>` — version number
- `.subtitle` — schedule output date
- `.info-bar` — planned start, estimated release, special notes (use `<span class="hl-red">` for leave, `<span class="hl-orange">` for makeup days)
- `<p class="note">` — free-text annotation
- `const DAYS = [...]` — date array from start date to release date + 1 buffer column
- `const ROWS = [...]` — personnel and phase data

**Do not modify `scripts/gantt.css` or `scripts/gantt.js`.**

---

## DAYS Array Quick Reference

```js
// Minimal entry (normal workday Mon–Fri):
{ date: "MM/DD", dow: 0-6 }

// Optional fields:
//   holiday: true          — statutory holiday (rendered red)
//   workday: true          — substitute workday or confirmed overtime (rendered yellow, counts as workday)
//   overtimePending: true  — unconfirmed overtime (rendered as dashed box, still off day)
//   name: "..."            — header tooltip text (holiday name, makeup reason, etc.)
//
// dow: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
// Add one buffer column after the release date
```

## ROWS Array Quick Reference

```js
// Group header:
{ group: "后端开发", cls: "" }
// cls options: "" (blue default) / "green" / "orange" / "gray"

// Person row:
{ label: "alice", bars: [{ label, cls, start, end, tooltip }] }
// Pure English labels render as <code> tags automatically

// Bar types (cls):
// bar-dev    → blue   (#4f86f7)  Development
// bar-wait   → gray   (#cbd5e1)  Waiting for API protocol
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
| `scripts/gantt.css` | Shared CSS — load via CDN or inline |
| `scripts/gantt.js` | Shared JS renderer — load via CDN or inline |
| `references/gantt-template.md` | HTML skeleton + DAYS/ROWS data specification |
| `references/scheduling-rules.md` | Date calculation rules, standard phase durations, leave handling |
| `examples/v1.0.0-schedule.md` | Example schedule document (fictional team data) |
| `examples/v1.0.0-schedule.html` | Example Gantt chart — normal scenario (CDN mode) |
| `examples/visual-test.html` | Visual edge-case test — overtime pending, long holiday bridge, seamless transitions |
