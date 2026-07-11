# 新团队 PRD 审查：`PRD Document.docx`

> **历史审查说明：** 本文对 teammate PRD 的风险判断仍有效，但其中将 Packing Puzzle 视为当前玩法的表述已经过期。团队后续采纳了 character space/world simulation 洞察并发展为 Lemonade Lane；当前规则以 `01-prd.md` 和 `10-business-and-game-logic.md` 为准。

> 日期：2026-07-11  
> 原文件：`docs/PRD Document.docx`  
> 结论：保留为原始输入，不作为并行开发规格；唯一开发 PRD 仍为 `01-prd.md`。

## 1. 总体判断

新文档描述的是：

> 一个整合 profile、dashboard、真实/虚拟 marketplace、模拟银行账户、wishlist、预算统计、虚拟 lemon currency、角色房间和 arcade 的个人金融 super-app。

当前项目描述的是：

> 一个在购买前介入，通过 Cooling List、My Stuff、Budget Packing Puzzle 和 planned allocation 改变冲动消费决定的单一行为工具。

二者不是页面细节差异，而是产品战略差异。新 PRD 若全部接受，会丢失已确定的核心行为闭环，并在约 20 小时内形成多个浅页面。

## 2. 与题目的根本冲突

### Real-life + virtual marketplace

新 PRD 将 Marketplace 标为 `VERY HIGH`，允许用户选择物品并加入 wishlist。这使产品主动展示、分类和分发更多可购买物，与“减少 consumerism/materialism”直接冲突。

若 marketplace 推荐二手替代品，仍需供给、搜索、履约与来源；若只是 seed catalog，则只是模拟购物页面。

**裁决：删除。** 用 `Cooling List` 和 `My Stuff` 取代，不建立商品发现入口。

### Lemon currency 与虚拟消费

新 PRD：每省一美元获得 lemon currency，可用于角色服装、房间、小游戏和 prizes。

问题：

- 把“没有购买”直接等同于真实 savings。
- 用户可录入虚假高价 want 刷 lemon。
- 又建立虚拟货币、商店、装饰和奖品，复制 acquisition/collection loop。
- 用户的注意力从现实体验重新转向虚拟物品。
- real-life prizes 需要资金、库存、合作、规则与防滥用。

**裁决：删除货币和商店。** 保留不可消费的 Reflection XP；planned allocation 推进现实目标。Cosmetic change 只能由 milestone 自动解锁，不可购买。

### Arcade

小游戏、语言学习和 prizes 与购买决策没有共享数据或行为机制。它们增加页面数量，却不证明减少消费。

**裁决：删除独立 Arcade。** Budget Packing Puzzle 本身就是核心 game mechanic，不需要另设游戏中心。

## 3. 与产品真实性的冲突

### Bank account simulation

模拟 bank balance、expected income 和 credit score 会让评委追问数据来源。Credit score 尤其涉及复杂地区规则，seed 数字容易显得误导。

**裁决：删除 Bank Account 页面和 credit score。** Dashboard 只显示用户手动设置的 monthly wants budget、goal 和 planned allocations，并明确不是银行余额。

### Every saved dollar

Skip 不等于钱已经存下。该问题已在两份 PRD 合并时裁决。

**裁决：** `Skip -> available to redirect -> user confirms planned allocation`。

### AI necessity classification

Necessity/need/want/wish 取决于用户处境；例如手机对某些人是奢侈品，对另一些人是工作必需。AI 无权最终分类。

**裁决：** AI 最多建议 `need / replacement / want`，显示理由并允许覆盖。P0 使用用户选择，不依赖 AI。

## 4. 与 24 小时范围的冲突

| 新 PRD 模块 | 实际依赖 | 当前裁决 |
|---|---|---|
| Profile/auth | backend/auth/session/forms | 删除，seed persona |
| Link dashboard | 多页面导航 | Dashboard 只连核心闭环 |
| Character library | 资产、customisation、inventory | 仅保留视觉 nook/marker 的可能性 |
| Real marketplace | catalog/search/data/handoff | 删除 |
| Virtual marketplace | currency/store/inventory/balance | 删除 |
| Bank simulation | ledger/income/credit/statistics | 删除 |
| Wishlist hierarchy | AI classification + product catalog | 改为 Cooling List + user classification |
| Budget statistics | transactions/charts | 仅保留 wants budget 与 frequency insight |
| Arcade | 多个 mini-game | 删除，Packing Puzzle 为唯一 game |

新 PRD 的 `VERY HIGH` 总量本身已超过剩余时间：Profile、Dashboard、Marketplace 同时 VERY HIGH，却缺少 Cooling、Review、Allocate 等核心状态。

## 5. 与已确认视觉的冲突

### 可复用

- `cozy nook where your character rests` 与手绘 sticker 风格相容。
- 角色/房间可以作为 goal milestone 的被动视觉变化。
- Dashboard 强调 visual clarity 的目标正确。

### 不可复用

- 角色服装/房间装饰 marketplace 会把产品变成虚拟物品消费。
- Arcade 与当前 illustrated board 气质不需要同时存在。
- 每个页面都做卡通插画会降低金额、计时和分类的可读性。

**裁决：** cozy nook 可作为 Dashboard 的一部分或未来 companion feedback；不建 Library 商店，不允许用户用 lemon 购买装饰。

## 6. 可以提炼的有效观察

### Needs hierarchy

新 PRD 的 `necessities > needs > wants > wishes` 观察有价值，但四级语义重叠。

建议简化为：

- `Need`：维持生活/工作必须。
- `Replacement`：替换已坏或不再适用物。
- `Want`：可延迟的新增消费。

`Wish` 不需要单独状态；所有 want 都可以进入 Cooling List。

### Visual financial clarity

复杂金融信息应转换成一个可操作 board，而不是 pie chart/table 大全。Packing Puzzle 正是该观察的更好实现。

### Character space

角色空间可作为非惩罚 meta feedback：

- Reflection XP 解锁新动作/表情。
- Goal milestone 自动改变背景。
- Buy 不导致房间破损或角色受苦。
- 无货币、无 shop、无装备 inventory。

## 7. 对六项评分的影响

| 维度 | 若采用新 PRD 全量 | 按当前裁决 |
|---|---|---|
| Innovation | 普通 finance super-app + virtual economy | 购买前 Packing Puzzle 具备明确 mechanic |
| Technical | 页面多但每个浅 | state machine + packing engine + persistence + animation |
| UX | 导航与模块过载 | 一条核心闭环 |
| Practicality | marketplace/bank/prizes 无法履约 | 手动数据、planned state、可运行 |
| Pitch | 3 分钟讲不完 | 一个商品、一块棋盘、一次取舍 |
| Teamwork | 功能分散不等于协作 | 每人交付研究/视觉/故事/运营成果 |

## 8. 最终合并裁决

### 纳入

- 18–30 用户。
- Visual financial clarity。
- Need/Replacement/Want hierarchy。
- Cozy character nook 作为可选 meta visual。
- 个性化 profile 的视觉信息，但不做 auth。

### 修改后纳入

- Wishlist -> Cooling List。
- Budgeting statistics -> wants budget board + frequency insight。
- Character growth -> Reflection XP/milestone 自动反馈。

### 拒绝

- Real marketplace。
- Virtual marketplace。
- Lemon currency。
- Cosmetic shop/inventory。
- Real-life prizes。
- Arcade。
- Bank account simulation。
- Credit score。
- AI 自动决定 necessity。
- Profile/auth P0。

## 9. 当前唯一 P0

```text
Seed persona / goal
  -> Dashboard
  -> Capture want
  -> My Stuff + frequency + opportunity cost
  -> Cooling
  -> Ready review
  -> Packing Puzzle trade-off
  -> Buy / Skip
  -> Optional planned allocation
  -> Goal + XP feedback
```

任何来自新 PRD 的模块若不能放进这条链，就不进入当前开发。
