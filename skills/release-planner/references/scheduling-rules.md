# Scheduling Rules

Date calculation rules, standard phase durations, and leave handling for release planning.

---

## 1. Workday Calculation

### Basic Rules

- **Skip weekends**: `dow === 0` (Sun) or `dow === 6` (Sat) are never counted as workdays
- **Skip statutory holidays**: Days marked `holiday: true` in the DAYS array
- **Count substitute workdays**: Weekend makeup days are treated as normal workdays

### Counting N Workdays

"Start from date D, schedule N workdays" means:
- D itself is workday 1 (if D is a workday)
- Keep advancing by one calendar day, skipping off days, until N workdays have been counted
- The Nth workday is the end date

### Example

> alice starts 03/10 (Mon), duration 5 workdays → 03/10, 03/11, 03/12, 03/13, 03/14 → end = 03/14 (Fri)

---

## 2. Standard Release Rhythm

```
开发阶段
  → [联调①] 主链路联调         3 workdays
  → [联调②] 特殊流程联调        2 workdays
  → [测试环境测试]              5 workdays   (starts next workday after 联调② ends)
  → [预生产测试]                3 workdays   (starts next workday after 测试环境 ends)
  → [产品回归]                  2 workdays   (parallel with 预生产, starts same day)
  → [版本发布]                  里程碑        (next Monday after 预生产 ends)
```

### Parallelism Rules

| Phase | Parallel with |
|-------|--------------|
| Test case writing | Dev (starts dev day 2) |
| Test case review | 1 day before 联调① starts |
| 产品回归 (2d) | 预生产测试 (starts same day) |

---

## 3. Phase Start / End Alignment

| Phase | Starts After |
|-------|-------------|
| 联调① | Last dev completion date (longest track) |
| 联调② | Next workday after 联调① ends |
| 测试环境测试 | Next workday after 联调② ends |
| 预生产测试 | Next workday after 测试环境 ends |
| 产品回归 | Same day as 预生产测试 |
| 版本发布 | Next **Monday** after 预生产/回归 ends; skip if that Monday is a holiday |

---

## 4. Personal Leave Handling

- Add a `bar-leave` bar covering the leave date range (inclusive of weekends if the leave period spans them, but only workdays actually count)
- Keep the dev bar spanning across the leave period; the renderer automatically skips off days
- Adjust the person's dev end date to account for missed workdays

### Example

> bob: 4 workdays of dev, takes leave 03/12–03/13 (Wed–Thu)
> - Dev bar: `start: "03/10", end: "03/17"` (spans the leave, renderer skips 03/12–03/13 and 03/15–03/16)
> - Leave bar: `start: "03/12", end: "03/13"`
> - Actual workdays: 03/10, 03/11, 03/14, 03/17 = 4 days ✓

---

## 5. Holiday Handling

### Statutory Holiday (holiday: true)

- Mark the day with `holiday: true` in DAYS
- All bars automatically bridge over holidays with a dashed line
- The renderer does not count holidays as workdays when calculating bar segments

### Substitute Workday (补班)

- The makeup day falls on a weekend (e.g., Saturday)
- In DAYS, keep the correct `dow` (e.g., `6` for Saturday) and set `holiday: false`
- The renderer treats it as a normal workday because `isOff = dow===0 || dow===6 || holiday`
- **Note**: Since `dow===6` → `isOff` returns true, substitute Saturdays are still treated as off by the default renderer. Only substitute workdays that fall on a **Sunday** (dow=0) have the same issue. For a makeup day on an actual weekday (Mon–Fri, dow 1–5), it works correctly with `holiday: false`.

---

## 6. Standard Phase Duration Reference

| Phase | Default Duration | Notes |
|-------|-----------------|-------|
| Development | Varies per person | Determined by user input |
| Test case writing | 3 workdays | Parallel with dev (starts dev day 2) |
| Test case review | 1 workday | Day before 联调① |
| 联调① (main path) | 3 workdays | After longest dev track |
| 联调② (special flow) | 2 workdays | After 联调① |
| QA env testing | 5 workdays | After 联调② |
| Pre-prod testing | 3 workdays | After QA env |
| Product review | 2 workdays | Parallel with pre-prod |
| Release | Milestone | Next Monday after pre-prod ends |

Adjust durations based on user-provided information when it differs from these defaults.

---

## 7. Release Date Selection

1. Identify the last completion date among: 预生产测试 end and 产品回归 end
2. Find the next calendar Monday after that date
3. If that Monday is a statutory holiday, advance to the following Monday
4. Record as milestone: `{ label: "版本发布", milestone: "MM/DD", milestoneTooltip: "🎯 版本发布\n{date}（周一）" }`
