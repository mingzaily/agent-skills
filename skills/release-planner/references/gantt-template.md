# Gantt Chart HTML Template

Generate `开发排期甘特图.html` by filling the HTML skeleton below with project-specific data. CSS and JS are provided as shared assets — choose CDN or inline mode.

---

## Asset References

| File | CDN URL |
|------|---------|
| `scripts/gantt.css` | `https://cdn.jsdelivr.net/gh/mingzaily/agent-skills@main/skills/release-planner/scripts/gantt.css` |
| `scripts/gantt.js` | `https://cdn.jsdelivr.net/gh/mingzaily/agent-skills@main/skills/release-planner/scripts/gantt.js` |

### Loading Mode

**Mode A — CDN (default, recommended)**

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mingzaily/agent-skills@main/skills/release-planner/scripts/gantt.css">
...
<script src="https://cdn.jsdelivr.net/gh/mingzaily/agent-skills@main/skills/release-planner/scripts/gantt.js"></script>
```

**Mode B — Inline (offline / air-gapped environments)**

Read `scripts/gantt.css` and `scripts/gantt.js`, copy their full contents into `<style>` and `<script>` tags respectively.

---

## HTML Skeleton

Only the parts marked `{...}` need to be filled. Everything else is fixed structure.

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{版本号} 开发排期甘特图</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mingzaily/agent-skills@main/skills/release-planner/scripts/gantt.css">
</head>
<body>

<h1>{版本号} 版本开发排期</h1>
<p class="subtitle">排期输出日期：{今日日期}</p>

<div class="info-bar">
  <div><strong>计划开始</strong>{开始日期}</div>
  <div><strong>预计发版</strong>{发版日期（含星期）}</div>
  <div><strong>特殊说明</strong>{用 <span class="hl-red"> 包裹请假，<span class="hl-orange"> 包裹补班}</div>
</div>

<div class="tooltip" id="tooltip"></div>

<div class="gantt-container" id="gantt-container">
<div class="gantt" id="gantt"></div>
</div>

<div class="legend">
  <div class="legend-item"><div class="legend-dot bar-dev"></div>开发</div>
  <div class="legend-item"><div class="legend-dot bar-wait" style="border:1px solid #94a3b8"></div>等待协议</div>
  <div class="legend-item"><div class="legend-dot bar-leave"></div>请假</div>
  <div class="legend-item"><div class="legend-dot bar-joint"></div>联调</div>
  <div class="legend-item"><div class="legend-dot bar-test"></div>测试环境</div>
  <div class="legend-item"><div class="legend-dot bar-pre"></div>预生产</div>
  <div class="legend-item"><div class="legend-dot bar-review"></div>产品回归</div>
  <div class="legend-item"><div class="legend-dot" style="background:#1a1a2e; transform:rotate(45deg); border-radius:2px;"></div>里程碑</div>
</div>

<p class="note">{注释说明，用 <strong> 包裹人名}</p>

<script>
// ── DATA SECTION (only modify below) ────────────────────
const DAYS = [
  // ...see DAYS specification below
];

const ROWS = [
  // ...see ROWS specification below
];
</script>
<script src="https://cdn.jsdelivr.net/gh/mingzaily/agent-skills@main/skills/release-planner/scripts/gantt.js"></script>
</body>
</html>
```

---

## DAYS Array Specification

### Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `date` | Yes | `"MM/DD"` | Calendar date |
| `dow` | Yes | `0-6` | Day of week (0=Sun, 6=Sat) |
| `holiday` | No | `true` | Statutory holiday — rendered red |
| `workday` | No | `true` | Substitute workday or confirmed overtime — overrides weekend, rendered yellow |
| `overtimePending` | No | `true` | Unconfirmed overtime — renders dashed box, still counted as off day |
| `name` | No | `string` | Header tooltip text (holiday name, makeup reason, etc.) |

### Rules

- Cover from start date to release date **plus one buffer column**
- One entry per calendar day (including weekends and holidays)
- Normal workdays (Mon–Fri, not holiday) need only `date` and `dow`
- Do **not** set `holiday: true` for regular weekends — `dow` handles that

### Example

```js
const DAYS = [
  { date: "04/14", dow: 2 },                                                        // Normal workday
  { date: "04/18", dow: 6 },                                                        // Weekend — gray automatically
  { date: "04/25", dow: 6, overtimePending: true, name: "预选加班位 (视测试进度)" },     // Overtime pending — dashed box
  { date: "05/01", dow: 5, holiday: true, name: "五一劳动节" },                        // Holiday — red
  { date: "05/09", dow: 6, workday: true, name: "节假日调休补班 (补5/5周二)" },          // Makeup workday — yellow
];
```

---

## ROWS Array Specification

### Row Types

| Type | Shape | Notes |
|------|-------|-------|
| Group header | `{ group: "后端开发", cls: "" }` | `cls`: `""` (blue) / `"green"` / `"orange"` / `"gray"` |
| Person | `{ label: "alice", bars: [...] }` | Pure-English labels auto-render as `<code>` |
| Milestone | `{ label: "版本发布", milestone: "MM/DD", milestoneTooltip: "..." }` | Diamond shape, no bars |

### Bar Object

```js
{
  label: "开发",              // Text on bar (shown at absolute start only)
  cls: "bar-dev",             // CSS class — controls color
  start: "04/14",             // Inclusive start (MM/DD)
  end: "04/17",               // Inclusive end (MM/DD) — renderer auto-skips off days
  tooltip: "alice · 开发<br>04/14 – 04/17（4天）<br>主链路"
}
```

### Bar Class Reference

| `cls` | Color | Use |
|-------|-------|-----|
| `bar-dev` | `#4f86f7` blue | Development |
| `bar-wait` | `#cbd5e1` gray | Waiting for API protocol |
| `bar-leave` | `#f87171` red | Personal leave |
| `bar-joint` | `#34c97e` green | Joint debugging |
| `bar-test` | `#f6a623` orange | QA environment testing |
| `bar-pre` | `#a855f7` purple | Pre-production testing |
| `bar-review` | `#ec4899` pink | Product review |

### Seamless Continuity Algorithm

When a bar spans non-workdays, the renderer splits it into segments:

- **Absolute start** (first segment of the bar): `left: 2px`, keep left border-radius
- **Absolute end** (last segment): keep right border-radius, 2px right gap
- **Middle segments**: `left: 0`, no border-radius — flush with adjacent cells
- **Off-day cells** between segments: dashed bridge line (`bar-bridge`) or dashed box (`bar-pending` for `overtimePending` days)
- Width: `calc(N00% + (N-1)px - gap)` to span exactly N grid cells

### Tooltip Convention

```
{name} · {phase}<br>{start} – {end}（{workdays}天）<br>{note}
```

### Multiple Bars per Person

```js
{ label: "bob", bars: [
  { label: "开发", cls: "bar-dev", start: "04/14", end: "04/14", tooltip: "bob · 开发<br>04/14" },
  { label: "请假", cls: "bar-leave", start: "04/15", end: "04/17", tooltip: "bob · 请假<br>04/15 – 04/17" },
  { label: "开发", cls: "bar-dev", start: "04/20", end: "04/20", tooltip: "bob · 开发收尾" }
]}
```
