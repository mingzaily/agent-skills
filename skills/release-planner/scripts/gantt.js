/*
 * Gantt Chart Renderer — release-planner skill
 * https://github.com/mingzaily/agent-skills
 *
 * Usage:
 *   CDN:    <script src="https://cdn.jsdelivr.net/gh/mingzaily/agent-skills@main/skills/release-planner/scripts/gantt.js"><\/script>
 *   Inline: Copy contents into <script> tag
 *
 * Requires: const DAYS and const ROWS defined before this script runs.
 * Requires: <div id="gantt-container"><div id="gantt"></div></div> and <div id="tooltip"></div> in HTML.
 */

// ── Core logic ──────────────────────────────────────────
const isOff = (d) => (d.dow === 0 || d.dow === 6 || d.holiday) && !d.workday;

const today = new Date();
const todayStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

const getDayTip = (d) => {
  if (d.name) return d.name;
  if (d.holiday) return '法定节假日';
  if (d.workday) return '调休工作日';
  if (d.dow === 6) return '休息日 (周六)';
  if (d.dow === 0) return '休息日 (周日)';
  return '';
};

// ── Build grid ──────────────────────────────────────────
const gantt = document.getElementById('gantt');
gantt.style.gridTemplateColumns = `160px repeat(${DAYS.length}, minmax(30px, 1fr))`;

// Header
const headLabel = document.createElement('div');
headLabel.className = 'header-cell label-col';
headLabel.textContent = '人员 / 阶段';
gantt.appendChild(headLabel);

DAYS.forEach(d => {
  const div = document.createElement('div');
  const isToday = d.date === todayStr;
  div.className = `header-cell ${isToday ? 'today' : ''} ${d.holiday ? 'holiday' : isOff(d) ? 'weekend' : d.workday ? 'workday-makeup' : ''}`;
  if (isToday) div.id = 'today-col';

  const tip = getDayTip(d);
  if (tip) div.dataset.tip = tip;

  div.innerHTML = `${d.date}<br><span style="font-weight:400;color:#aaa">${['日','一','二','三','四','五','六'][d.dow]}</span>`;
  gantt.appendChild(div);
});

// Rows
let rowCounter = 0;
ROWS.forEach(row => {
  if (row.group) {
    const g = document.createElement('div');
    g.className = `group-cell ${row.cls}`;
    g.textContent = row.group;
    gantt.appendChild(g);
    return;
  }

  rowCounter++;
  const rowId = `row-${rowCounter}`;

  const lc = document.createElement('div');
  lc.className = 'label-cell';
  lc.dataset.row = rowId;
  lc.innerHTML = /^[a-z]+$/i.test(row.label) ? `<code>${row.label}</code>` : row.label;
  gantt.appendChild(lc);

  // Segment calculation: split bars at off-day boundaries
  const segments = [];
  if (row.bars) {
    row.bars.forEach(bar => {
      const si = DAYS.findIndex(x => x.date === bar.start);
      const ei = DAYS.findIndex(x => x.date === bar.end);
      if (si === -1 || ei === -1) return;
      let start = null;
      for (let i = si; i <= ei + 1; i++) {
        const off = i > ei || isOff(DAYS[i]);
        if (!off && start === null) start = i;
        else if (off && start !== null) {
          segments.push({ bar, si: start, ei: i - 1 });
          start = null;
        }
      }
    });
  }

  // Day cells
  DAYS.forEach((d, di) => {
    const dc = document.createElement('div');
    dc.className = `day-cell ${d.holiday ? 'holiday' : isOff(d) ? 'weekend' : d.workday ? 'workday-makeup' : ''}`;
    dc.dataset.row = rowId;

    // Milestone
    if (row.milestone === d.date) {
      const diamond = document.createElement('div');
      diamond.className = 'milestone-diamond';
      dc.appendChild(diamond);
      dc.dataset.tip = row.milestoneTooltip;
    }

    // Solid bar segments with seamless continuity
    segments.forEach(seg => {
      if (seg.si === di) {
        const span = seg.ei - seg.si + 1;
        const isAbsoluteStart = DAYS[seg.si].date === seg.bar.start;
        const isAbsoluteEnd = DAYS[seg.ei].date === seg.bar.end;

        const b = document.createElement('div');
        b.className = `bar ${seg.bar.cls}`;

        // Dynamic boundary: flush edges for non-absolute boundaries
        b.style.left = isAbsoluteStart ? '2px' : '0';
        const rightGap = isAbsoluteEnd ? 2 : 0;
        const leftGap = isAbsoluteStart ? 2 : 0;
        b.style.width = `calc(${span}00% + ${span - 1}px - ${leftGap + rightGap}px)`;

        if (!isAbsoluteStart) {
          b.style.borderTopLeftRadius = '0';
          b.style.borderBottomLeftRadius = '0';
        }
        if (!isAbsoluteEnd) {
          b.style.borderTopRightRadius = '0';
          b.style.borderBottomRightRadius = '0';
        }

        if (isAbsoluteStart) {
          b.innerHTML = `<span class="bar-label">${seg.bar.label}</span>`;
        }
        b.dataset.tip = seg.bar.tooltip || seg.bar.label;
        dc.appendChild(b);
      }
    });

    // Bridge / pending on off-days
    if (isOff(d) && row.bars) {
      row.bars.forEach(bar => {
        const si = DAYS.findIndex(x => x.date === bar.start);
        const ei = DAYS.findIndex(x => x.date === bar.end);
        if (di > si && di < ei) {
          const colors = { 'bar-dev': '#4f86f7', 'bar-leave': '#f87171', 'bar-joint': '#34c97e', 'bar-test': '#f6a623', 'bar-pre': '#a855f7', 'bar-review': '#ec4899' };
          const color = colors[bar.cls] || '#aaa';

          if (d.overtimePending) {
            const p = document.createElement('div');
            p.className = 'bar-pending';
            p.style.borderColor = color;

            // Seamless connection with adjacent segments
            p.style.left = '0';
            p.style.right = '0';
            p.style.borderRadius = '0';

            p.dataset.tip = d.name || '加班待定';
            dc.appendChild(p);
          } else {
            const bridge = document.createElement('div');
            bridge.className = 'bar-bridge';
            bridge.style.borderColor = color;
            bridge.style.left = '0';
            bridge.style.right = '0';
            dc.appendChild(bridge);
          }
        }
      });
    }
    gantt.appendChild(dc);
  });
});

// ── Tooltip + row hover ─────────────────────────────────
const tooltip = document.getElementById('tooltip');
gantt.addEventListener('mousemove', (e) => {
  const target = e.target.closest('[data-tip]');
  if (target) {
    tooltip.innerHTML = target.dataset.tip;
    tooltip.style.display = 'block';
    tooltip.style.left = (e.clientX + 15) + 'px';
    tooltip.style.top = (e.clientY - 10) + 'px';
  } else tooltip.style.display = 'none';

  const row = e.target.closest('[data-row]');
  document.querySelectorAll('[data-row]').forEach(el => el.classList.remove('row-hover'));
  if (row) {
    document.querySelectorAll(`[data-row="${row.dataset.row}"]`).forEach(el => el.classList.add('row-hover'));
  }
});

// ── Auto-scroll to today ────────────────────────────────
window.onload = () => {
  const todayCol = document.getElementById('today-col');
  if (todayCol) {
    const wrap = document.getElementById('gantt-container');
    const offset = todayCol.offsetLeft - wrap.offsetWidth / 2 + 160;
    wrap.scrollTo({ left: offset, behavior: 'smooth' });
  }
};
