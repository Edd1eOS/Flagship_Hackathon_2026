# 队友 PRD 与会议版 PRD 冲突审查

> 日期：2026-07-11  
> 状态：审查完成；冲突已按第 13 节原则合并进 `01-prd.md` v0.2。  
> 比较对象：队友提交的 Savour PRD 与 `docs/01-prd.md`。

## 1. 总结

两份 PRD 的主循环一致，不需要重新选方向：

`设目标 -> 记录想买物 -> 机会成本/重复提醒 -> 冷静期 -> 重新决定 -> 重定向金额 -> 游戏反馈`

队友版更擅长 **叙事、gain framing、功能命名和 demo 节奏**；会议版更擅长 **可验证指标、状态真实性、安全游戏化、工程范围和验收标准**。

最合理的合并方式是：

- 用队友版作为 pitch/product narrative。
- 用会议版作为 behavioral contract 和 engineering spec。
- 不直接把两个 feature list 相加。

## 2. 完全一致的部分

| 主题 | 队友 PRD | 会议版 PRD | 结论 |
|---|---|---|---|
| 目标用户 | 18–30 学生/年轻职场人 | 18–30 学生/年轻成年人 | 一致，已冻结 |
| 干预时刻 | 购买前 | 购买前 | 一致 |
| 核心动作 | Log a want | Capture an impulse | 只是命名差异 |
| 冷静期 | 24 小时 | 24 小时 | 一致 |
| 机会成本 | 体验/目标百分比 | 预算/目标百分比 | 一致，队友文案更强 |
| 分类 | Needs vs Wants | need/want/replacement | 可合并，保留 replacement |
| 选择权 | Still buy or Skip | Buy anyway / Skip / Extend | 一致，会议版状态更完整 |
| 资金处理 | 转向目标 | planned allocation | 意图一致，真实性处理不同 |
| 数据接入 | MVP 手动记录 | MVP 手动/seed | 一致 |
| 银行连接 | stretch/out of scope | future/out of scope | 一致 |
| 演示故事 | Log -> wait -> skip -> world grows | Capture -> wait -> resolve -> allocate -> progress | 一致 |

## 3. 关键外部竞争冲突

### 队友版原声明

> no budgeting app tackles the psychology of the moment of purchase  
> the cool-off + opportunity-cost combo is a novel behavioural intervention

这两句目前不可使用。

### 已存在的直接竞品

- **HoldUp**：购买前输入商品、工作小时机会成本、cooldown、skip savings、streak、挑战和徽章，且数据本地保存。[HoldUp](https://holdup-app.com/)
- **Forgo**：明确自称 pre-purchase intervention，识别高风险消费时刻、提供短暂停顿，并把 forgone amount 映射到还债、应急储蓄和目标进度。[Forgo](https://forgoapp.com/)
- **BuyBye**：展示工作时间和未来机会成本，支持 Buy / Don't Buy / Unsure，并累计跳过金额。[BuyBye](https://buybye.fun/)
- **SavePal / Unspent / Skip**：覆盖 AI 消费洞察、skip logging、目标和 no-spend tracking 的不同组合。

### 对创新定义的影响

`cool-off + opportunity cost + goal + streak` 已经不是创新组合。原队友 PRD 若继续使用当前 feature set，创新分会是主要弱项，而非强项。

可防守的新差异需要从以下二者中至少保留一个：

1. **Owned-item substitution**：不仅提醒花费，还证明用户已经拥有能满足相同用途的物品。
2. **Experience conversion**：不是把 `$180` 记入抽象 savings，而是把它转成一个具体、可计划的现实体验里程碑。

更强的一句话：

> Existing pause apps show what you did not spend. Lemonade shows what you already have, and what meaningful experience that same choice can build.

仍然不能说“市场无人做”，只能说这是本产品相对于已核验直接竞品的组合差异。

## 4. 产品逻辑冲突

### Conflict A — App 不能锁住购买

队友版：

> They can't "buy" it in-app until the timer ends.

但 MVP 既不售卖商品，也无法阻止用户回到商店购买。因此这是假控制。

**合并建议：**

- 文案改为：`The decision remains in Cooling Off; Lemonade asks the user not to buy yet.`
- MVP 不声称阻止支付。
- 未来只有浏览器扩展、merchant integration 或用户自愿的支付控制才能增加实际 friction。

### Conflict B — Skip 是否自动增加目标金额

队友版：

> Every skipped want feeds their experience goal.

会议版：Skip 后先形成 `available to redirect`，用户明确 Allocate 后才增加 `planned allocation`。

队友版会把“没买”错误等同于“已经存下/还掉/转移这笔钱”。用户可能跳过 `$180` 鞋，但随后把钱花在别处。

**合并建议：采用会议版。**

- Skip：记录 decision outcome。
- Allocate：目标增加 planned amount。
- 银行未连接时始终显示 `planned`，不能叫 funded/saved。

### Conflict C — Wants Library 与个人物品 Library

会议原始讨论中的 `Library` 是用户已拥有物品库；队友 PRD 将 `Wants Library` 定义成待购商品 holding pen，并没有真正实现“你已经有类似物”。

两者不能使用同一个名字：

- `Decisions` 或 `Cooling List`：想买/已决定的商品。
- `My Stuff`：已有物品，用于 overlap。

**范围建议：** P0 的 `My Stuff` 只保留 8–12 件 seed + 简单手动新增，不做完整衣橱 App。

### Conflict D — 体验目标 vs 多目标

队友版主要只讲 experience goal；会议版允许 experience / savings / debt。

体验是本产品最强叙事，但并非所有用户都应先消费体验，尤其已有债务者。队友版也提到 debt，却没有反映在 goal model 中。

**合并建议：**

- Demo 使用一个体验目标，保住叙事。
- 产品数据模型保留 experience / savings / debt。
- 系统不主动把债务用户从还债引向旅行消费。

### Conflict E — 机会成本示例可能自相矛盾

队友版同时将 café/takeaway 视为冲动消费，又将商品显示为 `= 7 café trips`。这可能只是把一种频繁消费推荐成另一种。

**合并建议：** 优先显示：

- `= 4% of your Japan trip`
- `= one hostel night`
- `= your next debt checkpoint`

只有用户明确选择 café social time 为有意义目标时，才使用 café 等价。

## 5. 游戏化冲突

### 队友版高风险机制

- `Skipping a want waters it; impulse-buying wilts it slightly.`
- 只为 skips 发主要 points/XP。
- `Don't break your 6-day streak!`
- skipped pile 越长越有成就感。
- no-takeaway 等限制型挑战。

这些与会议版的 `Pause, do not punish` 冲突，并产生四个问题：

1. 用户购买必要/合理物品时被惩罚。
2. 用户可能为了养世界或刷 XP 虚假录入大量 wants。
3. streak protection 使用产品正在批评的损失厌恶和紧迫操纵。
4. skipped pile 仍把商品数量和收藏作为核心视觉对象。

### 合并建议

- Buy anyway 不让世界枯萎，不扣 XP，不伤害角色。
- 完成到期复盘获得少量 reflection XP，与最终决定无关。
- 只有明确 planned allocation 才推进现实目标路线/世界。
- streak 不清零，可改成近 7 天按时处理率。
- 不做 skipped-product trophy collection。
- milestone 绑定现实目标，不绑定“忍住多少次”。

## 6. AI 功能冲突

### AI onboarding

队友版让 AI 根据对话自动生成预算、分类和目标。这适合作为演示体验，但 AI 不应自行决定财务预算。

**合并建议：P1。** AI 输出 suggestions，用户必须确认；P0 使用短表单和 seed profile。

### Ongoing AI coach

需要数周历史才能产生可信 weekly pattern。24 小时 demo 只能依赖 seed history，容易显得硬编码。

**合并建议：P1/P2。** 若做，只展示一条带 evidence chips 的洞察，例如 `5 takeaway considerations / 3 after 8pm`，明确来源；不把普通 LLM 文案称为行为智能。

### Coaching tone

gentle / funny 可以保留；`tough-love` 容易跨入羞辱，应改为 `direct`，并禁止侮辱、恐吓和金融建议。

## 7. 技术与范围冲突

| 队友版 | 当前事实 | 合并裁决 |
|---|---|---|
| React Native / Flutter / React web 三选一 | Xinxiang 最熟 Next.js/React，网站是必交 | 锁定 Next.js Web |
| Firebase/Supabase | 无 auth、多用户或真实 push 必要；且不偏好 Supabase | seed JSON + localStorage |
| Claude | 已有 Groq 使用经验/额度 | Groq，仅在 P0 稳定后 |
| Push notifications | 网站权限、后台任务和测试增加风险 | demo 内通知状态；真实 push future |
| Open banking | 21 小时内不可取 | future slide only |
| Ongoing coach | 需要历史与额外 UI | P1/P2 |
| Friend challenges | 多用户、隐私与同步 | future |
| Growing world full system | 资产与状态工作量大 | Goal Expedition + 单一进度动画 |

## 8. Marking Criteria 误读

队友版称：

> Optional friend challenges & shared goals give a social hook and a natural way to show teamwork in the build.

产品内社交功能不能证明 `Team Collaboration`。评委看的是团队是否有清晰分工、整合产物、研究、设计、讲述和交付过程。

**合并建议：** 删除这条评分映射。用 Jira/Trello 看板、commit、研究表、deck、视频脚本和两次彩排证明协作。

## 9. Demo 冲突

- 队友版写的是 90 秒 demo；正式 video/pitch 是 3 分钟。90 秒主路径可以保留，剩余时间用于问题、技术与影响口径。
- `Fast-forward 24h` 必须明确切换到 yesterday seed item，不能让界面动画假装真实经过 24 小时。
- `goal jumps to 66%` 只有在用户再点 `Plan $180 toward Japan` 后发生。
- `funded goal` 在无银行连接时改成 `planned toward goal`。

## 10. 品牌风险

`Savour` 的 gain framing 和澳式/英式拼写都不错，但存在：

- `Savour!` 已是一个处理剩余食物与 B2B 采购的可持续平台，和本题 waste 语境接近。[Savour!](https://www.savourapp.co/)
- `Savr` 已是带 XP、成就、储蓄 streak 的个人财务产品，语音和搜索相近。[Savr](https://www.savrfinance.com/)

Hackathon 临时名称可以使用，但不应声称品牌唯一；若要赛后继续，建议换名并做商标/域名检索。

候选中：

- `Later` 过于通用且难搜索。
- `Enough` 叙事强但通用。
- `Worth It` 与价值分析器常用语高度重叠。
- `Kept` 更偏拥有/衣橱。
- `Ripple` 与金融品牌高度拥挤。

团队随后决定不采用这些候选，品牌已统一为 `Lemonade`。

## 11. 建议的合并版 P0

### 必须做

1. Goal Expedition Dashboard：demo 使用 Japan trip，数据模型支持 savings/debt。
2. `I'm tempted` capture：name、price、category、motive。
3. Opportunity cost：目标百分比和一个具体体验/债务 milestone。
4. Needs / Wants / Replacement，用户可覆盖系统建议。
5. Frequency insight：基于 seed/本地 decisions 的真实计数。
6. `My Stuff` overlap：8–12 件 seed，显示 2–3 件已有替代物与理由。
7. Cooling List：创建 24h pending。
8. Yesterday seed decision：Bought / Skip / Extend。
9. Skip 后单独确认 planned allocation。
10. Allocation 后路线/世界推进；Buy 不枯萎。
11. Reset、empty、error/fallback 和响应式。

### P0 之后再决定

- AI 图片抽取或 onboarding suggestion，二选一，不同时做。
- 一条 evidence-backed coach insight。
- 更完整的世界动画。

### 删除或放 future

- Open banking、push、friends、leaderboard、shared goals、真实体验 marketplace、resale、donate、tiered timers、weekly AI coach、完整 auth/backend。

## 12. 推荐采用哪些队友文案

### 保留

- `spend on moments, not stuff`
- 从 loss 转为 gain 的核心 reframe。
- `Turn throwaway things into experiences you'll remember` 的叙事方向。
- Wants/Cooling Off/Opportunity Cost 等清晰功能命名。
- 90 秒主 demo 的节奏。
- 手动 logging first、银行 out of scope 的诚实声明。

### 修改

- `no budgeting app tackles...` -> `Most budgeting apps explain the past; Lemonade is designed for the decision in front of you.`
- `novel behavioural intervention` -> `a combined intervention grounded in postponement, reflection, owned-item substitution and goal reframing.`
- `they can't buy` -> `they commit to wait; Lemonade cannot block external checkout in the MVP.`
- `every skip feeds the goal` -> `every confirmed planned allocation advances the goal.`
- `impulse-buying wilts it` -> 删除。
- `Don't break your streak` -> `You have a decision ready to review.`
- `funded` -> `planned`，除非未来有银行核验。

## 13. 合并建议结论

两份 PRD 没有方向冲突，但队友版不能直接作为开发 spec，也不能直接用于 pitch。建议：

1. 队友版提供 narrative 和 demo 文案。
2. 会议版提供状态机、指标、安全规则、数据模型和 scope。
3. 采用本文件第 11 节作为合并 P0。
4. 已将 `01-prd.md` 升级为 v0.2；后续只维护这一份产品真相。

## 14. 2026-07-11 最终裁决记录

- 品牌最终统一为 **Lemonade**；此前 `Lenmonade` 是输入拼写错误。
- 采用自愿冷静期，不声称技术锁住购买。
- 采用 Skip -> explicit planned allocation 两阶段状态。
- 分离 Cooling List 与 My Stuff。
- Demo 讲体验，模型支持 experience/savings/debt。
- AI 只建议，用户最终确认。
- 所有游戏类型均禁止 purchase punishment、世界枯萎、角色受伤和 streak 清零。
- AI onboarding 为 P1；weekly coach/push/social/open banking 为 future。
- 差异化表述收窄到 owned-item substitution、concrete goal conversion 和 non-punitive feedback。
