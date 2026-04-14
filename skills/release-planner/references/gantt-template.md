# Gantt Chart HTML Template

Complete HTML template for `开发排期甘特图.html`. Copy the entire file and replace only the data section (title, header info, `DAYS`, and `ROWS`). Do not modify CSS, HTML structure, or JS rendering logic.

---

## Full Template

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{版本号} 开发排期甘特图</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif; background: #f5f6fa; color: #333; padding: 32px; }
  h1 { font-size: 20px; font-weight: 600; margin-bottom: 6px; color: #1a1a2e; }
  .subtitle { font-size: 13px; color: #888; margin-bottom: 24px; }
  .gantt-wrap { background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); overflow: auto; padding: 24px; }
  .gantt { display: grid; min-width: 900px; }
  .header-row { display: contents; }
  .header-cell { background: #f0f1f6; font-size: 11px; font-weight: 600; color: #666; text-align: center; padding: 6px 2px; border-right: 1px solid #e4e5ec; position: sticky; top: 0; z-index: 2; }
  .header-cell.label-col { text-align: left; padding-left: 10px; position: sticky; left: 0; z-index: 3; background: #f0f1f6; }
  .header-cell.weekend { background: #e8e9f0; color: #aaa; }
  .header-cell.holiday { background: #fde8e8; color: #e05555; }
  .header-cell.today { background: #e8f0fe; color: #1a56db; border-bottom: 2px solid #4f86f7; }
  .group-row { display: contents; }
  .group-cell { grid-column: 1 / -1; background: #f0f2fa; font-size: 12px; font-weight: 800; color: #3a3a5c; padding: 6px 12px; border-top: 2px solid #e4e5ec; letter-spacing: 0.8px; text-transform: uppercase; display: flex; align-items: center; gap: 8px; }
  .group-cell::before { content: ''; display: inline-block; width: 4px; height: 14px; border-radius: 2px; flex-shrink: 0; }
  .group-cell[data-color="blue"]::before   { background: #4f86f7; }
  .group-cell[data-color="green"]::before  { background: #34c97e; }
  .group-cell[data-color="orange"]::before { background: #f6a623; }
  .group-cell[data-color="purple"]::before { background: #a855f7; }
  .group-cell[data-color="pink"]::before   { background: #ec4899; }
  .group-cell[data-color="gray"]::before   { background: #94a3b8; }
  .data-row { display: contents; }
  .data-row:hover .label-cell,
  .data-row:hover .day-cell { filter: brightness(0.97); }
  .label-cell { font-size: 12px; font-weight: 500; padding: 0 10px; display: flex; align-items: center; min-height: 34px; background: #fff; position: sticky; left: 0; z-index: 1; border-right: 2px solid #e4e5ec; white-space: nowrap; }
  .label-cell code { background: #eef0fa; border-radius: 4px; padding: 1px 5px; font-size: 11px; font-family: "SF Mono", Menlo, monospace; color: #4a5568; }
  .day-cell { min-height: 36px; border-right: 1px solid #f0f1f6; display: flex; align-items: center; justify-content: center; position: relative; background: #fff; }
  .day-cell.weekend { background: #fafafa; }
  .day-cell.holiday { background: #fff5f5; }
  .day-cell.today { background: rgba(79,134,247,0.05); }
  .day-cell.today.weekend { background: rgba(79,134,247,0.07); }
  .day-cell.today.holiday { background: rgba(79,134,247,0.06); }
  .bar { position: absolute; height: 18px; border-radius: 4px; left: 2px; right: 2px; display: flex; align-items: center; padding-left: 6px; font-size: 10px; font-weight: 600; color: #fff; white-space: nowrap; overflow: visible; z-index: 1; }
  .bar-bridge { position: absolute; height: 0; top: 50%; left: 0; right: 0; border-top: 2px dashed; background: transparent !important; opacity: 0.5; z-index: 0; }
  .bar-label { position: absolute; top: 50%; transform: translateY(-50%); left: 6px; font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.95); white-space: nowrap; pointer-events: none; overflow: hidden; text-overflow: ellipsis; max-width: calc(100% - 10px); }
  .tooltip { position: fixed; background: rgba(26,26,46,0.92); color: #fff; font-size: 12px; padding: 6px 10px; border-radius: 6px; pointer-events: none; white-space: nowrap; z-index: 9999; display: none; box-shadow: 0 4px 12px rgba(0,0,0,0.2); line-height: 1.6; }
  .bar-dev    { background: #4f86f7; }
  .bar-leave  { background: #f87171; }
  .bar-joint  { background: #34c97e; }
  .bar-test   { background: #f6a623; }
  .bar-pre    { background: #a855f7; }
  .bar-review { background: #ec4899; }
  .milestone-cell { display: flex; align-items: center; justify-content: center; }
  .milestone-diamond { width: 14px; height: 14px; background: #1a1a2e; transform: rotate(45deg); border-radius: 2px; }
  .legend { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 20px; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #555; }
  .legend-dot { width: 12px; height: 12px; border-radius: 3px; }
  .info-table { display: flex; gap: 32px; flex-wrap: wrap; margin-bottom: 24px; }
  .info-item { font-size: 12px; color: #777; }
  .info-item strong { color: #333; margin-right: 4px; }
  .note { font-size: 12px; color: #888; margin-top: 16px; line-height: 1.7; }
  .note span { color: #f87171; font-weight: 600; }
</style>
</head>
<body>

<h1>{版本号} 版本开发排期</h1>
<p class="subtitle">排期输出日期：{今日日期}</p>

<div class="info-table">
  <div class="info-item"><strong>计划开始</strong>{开始日期}</div>
  <div class="info-item"><strong>预计发版</strong>{发版日期}</div>
  <div class="info-item"><strong>特殊说明</strong>{特殊说明}</div>
</div>

<div class="tooltip" id="tooltip"></div>

<div class="gantt-wrap">
<div class="gantt" id="gantt"></div>
</div>

<div class="legend">
  <div class="legend-item"><div class="legend-dot" style="background:#4f86f7"></div>开发</div>
  <div class="legend-item"><div class="legend-dot" style="background:#f87171"></div>请假</div>
  <div class="legend-item"><div class="legend-dot" style="background:#34c97e"></div>联调</div>
  <div class="legend-item"><div class="legend-dot" style="background:#f6a623"></div>测试环境测试</div>
  <div class="legend-item"><div class="legend-dot" style="background:#a855f7"></div>预生产测试</div>
  <div class="legend-item"><div class="legend-dot" style="background:#ec4899"></div>产品回归</div>
  <div class="legend-item"><div class="legend-dot" style="background:#1a1a2e;transform:rotate(45deg);border-radius:2px"></div>里程碑</div>
  <div class="legend-item"><div class="legend-dot" style="background:#fafafa;border:1px solid #ddd"></div>周末</div>
  <div class="legend-item"><div class="legend-dot" style="background:#fff5f5;border:1px solid #fdd"></div>节假日</div>
</div>

<p class="note">{注释说明}</p>

<script>
// ── 数据定义（只修改此处）─────────────────────────────────
const DAYS = [
  // { date: 'MM/DD', dow: 0-6, holiday: true/false }
  // dow: 0=日, 1=一, 2=二, 3=三, 4=四, 5=五, 6=六
  // 末尾加一列缓冲列（发版日期次日）
];

const ROWS = [
  // 分组：{ group: '后端开发', color: 'blue' }
  // 人员：{ label: 'name', bars: [{ label, cls, start, end, tooltip }] }
  // 请假：cls: 'bar-leave'，与开发 bar 并列
  // 联调：{ group: '联调', color: 'green' }，cls: 'bar-joint'
  // 测试：{ group: '测试', color: 'orange' }，cls: 'bar-test'/'bar-pre'/'bar-review'
  // 里程碑：{ label: '版本发布', milestone: 'MM/DD', milestoneTooltip: '...' }
];

// ── 渲染（不要修改以下内容）─────────────────────────────
const isOff = d => d.dow === 0 || d.dow === 6 || d.holiday;
const todayDate = (() => {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${mm}/${dd}`;
})();
const gantt = document.getElementById('gantt');
gantt.style.gridTemplateColumns = `160px repeat(${DAYS.length}, minmax(28px, 1fr))`;
const labelHeader = document.createElement('div');
labelHeader.className = 'header-cell label-col';
labelHeader.textContent = '人员 / 阶段';
gantt.appendChild(labelHeader);
DAYS.forEach(d => {
  const c = document.createElement('div');
  const isToday = d.date === todayDate;
  c.className = 'header-cell' + (isToday ? ' today' : '') + (d.holiday ? ' holiday' : (d.dow === 0 || d.dow === 6 ? ' weekend' : ''));
  c.innerHTML = d.date + '<br><span style="font-weight:400;color:#aaa">' + ['日','一','二','三','四','五','六'][d.dow] + '</span>';
  gantt.appendChild(c);
});
ROWS.forEach(row => {
  if (row.group !== undefined) {
    const g = document.createElement('div');
    g.className = 'group-cell';
    g.textContent = row.group;
    if (row.color) g.dataset.color = row.color;
    gantt.appendChild(g);
    return;
  }
  const lc = document.createElement('div');
  lc.className = 'label-cell';
  if (/^[a-z]+$/i.test(row.label)) { lc.innerHTML = `<code>${row.label}</code>`; }
  else { lc.textContent = row.label; }
  gantt.appendChild(lc);
  const barSegments = [];
  if (row.bars) {
    row.bars.forEach(bar => {
      const si = DAYS.findIndex(x => x.date === bar.start);
      const ei = DAYS.findIndex(x => x.date === bar.end);
      if (si === -1 || ei === -1) return;
      let segStart = null;
      for (let i = si; i <= ei + 1; i++) {
        const off = i > ei || isOff(DAYS[i]);
        if (!off && segStart === null) { segStart = i; }
        else if (off && segStart !== null) { barSegments.push({ bar, si: segStart, ei: i - 1 }); segStart = null; }
      }
    });
  }
  DAYS.forEach((d, di) => {
    const dc = document.createElement('div');
    const isToday = d.date === todayDate;
    dc.className = 'day-cell' + (isToday ? ' today' : '') + (d.holiday ? ' holiday' : (d.dow === 0 || d.dow === 6 ? ' weekend' : ''));
    if (row.milestone && row.milestone === d.date) {
      dc.classList.add('milestone-cell');
      const diamond = document.createElement('div');
      diamond.className = 'milestone-diamond';
      if (row.milestoneTooltip) { dc.dataset.tip = row.milestoneTooltip; }
      dc.appendChild(diamond);
    } else {
      barSegments.forEach((seg, idx) => {
        if (seg.si === di) {
          const span = seg.ei - seg.si + 1;
          const b = document.createElement('div');
          b.className = 'bar ' + seg.bar.cls;
          b.style.right = `calc(${span - 1} * (-100% - 1px) - 2px)`;
          const isFirst = !barSegments.slice(0, idx).some(s => s.bar === seg.bar);
          if (isFirst) { const bl = document.createElement('span'); bl.className = 'bar-label'; bl.textContent = seg.bar.label; b.appendChild(bl); }
          dc.appendChild(b);
        }
        if (di >= seg.si && di <= seg.ei && !isOff(d)) { if (!dc.dataset.tip) { dc.dataset.tip = seg.bar.tooltip || seg.bar.label; } }
      });
      if (isOff(d) && row.bars) {
        row.bars.forEach(bar => {
          const si = DAYS.findIndex(x => x.date === bar.start);
          const ei = DAYS.findIndex(x => x.date === bar.end);
          if (si === -1 || ei === -1) return;
          if (di > si && di < ei) {
            const colorMap = { 'bar-dev':'#4f86f7','bar-leave':'#f87171','bar-joint':'#34c97e','bar-test':'#f6a623','bar-pre':'#a855f7','bar-review':'#ec4899' };
            const bridge = document.createElement('div');
            bridge.className = 'bar-bridge';
            bridge.style.borderColor = colorMap[bar.cls] || '#aaa';
            dc.appendChild(bridge);
          }
        });
      }
    }
    gantt.appendChild(dc);
  });
});
const tooltip = document.getElementById('tooltip');
document.addEventListener('mousemove', e => {
  const target = e.target.closest('[data-tip]');
  if (target) {
    tooltip.innerHTML = target.dataset.tip;
    tooltip.style.display = 'block';
    const x = e.clientX + 14, y = e.clientY - 10, tw = tooltip.offsetWidth;
    tooltip.style.left = (x + tw > window.innerWidth ? x - tw - 24 : x) + 'px';
    tooltip.style.top = y + 'px';
  } else { tooltip.style.display = 'none'; }
});
</script>
</body>
</html>
```

---

## DAYS Array Specification

### Rules

- Cover from the planned start date to the release date **plus one buffer column**
- One entry per calendar day (including weekends and holidays)
- `dow` values: `0`=Sun, `1`=Mon, `2`=Tue, `3`=Wed, `4`=Thu, `5`=Fri, `6`=Sat
- `holiday: true` — statutory holidays only (days off by government decree)
- Weekends (`dow` 0 or 6) are automatically styled gray by the renderer; do **not** set `holiday: true` for regular weekends
- Substitute workdays (weekend makeup days): keep the correct `dow` value, set `holiday: false`

### Example

```js
const DAYS = [
  { date: "03/10", dow: 1, holiday: false }, // Mon
  { date: "03/11", dow: 2, holiday: false },
  { date: "03/15", dow: 6, holiday: false }, // Sat — rendered gray automatically
  { date: "03/16", dow: 0, holiday: false }, // Sun — rendered gray automatically
  { date: "04/03", dow: 4, holiday: true  }, // Qingming — rendered red
  { date: "04/07", dow: 1, holiday: false }, // Makeup workday (Mon) — treated as normal
];
```

---

## ROWS Array Specification

### Row Types

| Type | Shape | Notes |
|------|-------|-------|
| Group header | `{ group: "后端开发", color: "blue" }` | Spans full width; valid colors: `blue / green / orange / purple / pink / gray` |
| Person | `{ label: "alice", bars: [...] }` | Pure-English labels auto-render as `<code>`; Chinese labels render as plain text |
| Milestone | `{ label: "版本发布", milestone: "MM/DD", milestoneTooltip: "..." }` | Renders a diamond shape; no `bars` needed |

### Bar Object Fields

```js
{
  label: "开发",          // text shown inside the bar (first segment only)
  cls: "bar-dev",         // CSS class — controls color
  start: "03/10",         // MM/DD — inclusive; may span weekends/holidays
  end:   "03/14",         // MM/DD — inclusive; renderer auto-skips off days
  tooltip: "alice · 开发<br>03/10 – 03/14（5天）<br>后端主链路"
}
```

### Bar Class Reference

| `cls` | Color | Use |
|-------|-------|-----|
| `bar-dev` | `#4f86f7` blue | Development |
| `bar-leave` | `#f87171` red | Personal leave (overlay on dev bar) |
| `bar-joint` | `#34c97e` green | Joint debugging |
| `bar-test` | `#f6a623` orange | QA environment testing |
| `bar-pre` | `#a855f7` purple | Pre-production testing |
| `bar-review` | `#ec4899` pink | Product review |

### Tooltip Format Convention

```
{姓名} · {阶段}<br>{开始日期} – {结束日期}（{工作日天数}天）<br>{备注}
```

### Multiple Bars per Person

A person with leave overlapping development uses two bars:

```js
{
  label: "bob",
  bars: [
    { label: "开发", cls: "bar-dev",   start: "03/10", end: "03/17",
      tooltip: "bob · 开发<br>03/10 – 03/17（4天，不含请假）" },
    { label: "请假", cls: "bar-leave", start: "03/12", end: "03/13",
      tooltip: "bob · 请假<br>03/12 – 03/13（2天）" },
  ]
}
```
