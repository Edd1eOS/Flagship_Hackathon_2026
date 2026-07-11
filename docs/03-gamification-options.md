# 游戏化类型备选与建议

> **历史方案记录：** 本文中的 Packing Puzzle 排序已被后续团队决定覆盖。当前核心游戏是 Lemonade Lane pocket-world management simulation；开发规则以 `01-prd.md` 第 7 节和 `10-business-and-game-logic.md` 为准。本文仅保留方案演进与取舍依据。

> 日期：2026-07-11  
> 用户：18–30 岁学生和年轻成年人  
> 目标：中等偏强游戏感，但不复制消费操纵、虚拟囤积或财务羞辱。

## 1. 选择标准

每种游戏类型按五项判断：

1. 是否直接强化现实体验/储蓄/还债目标。
2. 是否会诱导用户刷任务、虚假录入或收集虚拟物品。
3. 三分钟 demo 是否一眼可懂。
4. 24 小时实现成本。
5. 是否适合 18–30 岁，而非过度儿童化。

研究口径需要克制：个人财务 App 的游戏化可能增强自主感、能力感、使用意愿和采用态度，但储蓄结果并非稳定必然；一项四周复制研究对“储蓄更多”只有初步支持，对“过程更有趣”没有支持。[PFM gamification study](https://www.sciencedirect.com/science/article/pii/S0265232321000235)、[Savings replication](https://openaccess.city.ac.uk/id/eprint/29823/)

2026 年金融游戏化系统综述也将个性化、易用性和目标一致性列为成功因素，同时指出疲劳、成本和操纵伦理问题。[Systematic review](https://www.sciencedirect.com/science/article/abs/pii/S2214635026000420)

## 2. Option A — Goal Expedition / 现实目标远征（推荐）

### 机制

用户的现实目标变成一张可推进的路线：

- 旅行：从家到目的地的路线节点。
- 活动：从计划、邀请、交通到入场的准备节点。
- 储蓄：从安全垫第一格到目标金额。
- 还债：穿越多个 checkpoint，逐步降低余额。

每次确认 planned allocation，角色/标记沿路线前进；处理一个 pending decision 获得少量 reflection XP，但不直接推进金钱距离。

### Demo 画面

跳过 `$120` 鞋并计划分配到旅行后，路线从 `62%` 推进到 `68%`，解锁下一个现实里程碑，例如 `Train booked` 或 `One night covered`。

### Pros

- 游戏状态与现实目标完全一致，最不容易沦为装饰。
- 体验、储蓄和还债都能共用同一结构。
- 三分钟内金额变化和地图推进非常清楚。
- 只需路径、节点和进度动画，工程成本可控。
- 有冒险感但不必做成儿童卡通。

### Cons

- 如果目标不是旅行，地图隐喻需要换皮。
- 只靠进度条可能被认为游戏性不足，需要加入 encounter/里程碑反馈。
- 不能把 planned allocation 伪装成已经订票或真正还债。

### 评分

**9/10。** 最适合当前核心循环和演示。

## 3. Option B — Build a Life / 世界建造

### 机制

用户不是积累商品，而是在建立一个代表理想生活的空间：

- 体验目标增加地点、人物和活动。
- 储蓄增加稳定基础设施。
- 还债逐步移除障碍或迷雾。

每个目标里程碑在场景中增加一个永久变化。

### Pros

- 视觉反馈强，适合 before/after。
- “少买物品，建造生活”与产品叙事一致。
- 可用同一场景承载不同目标。

### Cons

- 很容易滑向虚拟家具、皮肤和收藏，重新强化物质获得。
- 需要更多插画/状态资产，24 小时实现成本高。
- 若世界变化与真实目标没有清晰映射，会像普通 idle game。

### 安全设计

只解锁环境与经历，不提供虚拟商店、货币或随机箱子。

### 评分

**7.8/10。** 视觉上限高，但不如远征稳妥。

## 4. Option C — Companion Growth / 陪伴角色成长

### 机制

用户有一个陪伴者。按时复盘提高其能力或解锁动作；planned allocation 推动它与用户一起接近目标。

### Pros

- 情感连接强，容易产生持续使用动机。
- 一个角色能降低复杂 dashboard 的冷感。
- 可以承接团队提出的虚拟角色想法。

### Cons

- 容易变成 Tamagotchi 式损失厌恶：没完成任务，角色受苦，形成财务羞辱。
- 角色装扮和虚拟物品会复制收藏消费。
- 需要角色状态和动画资产。
- 对专业预算工具的可信度有一定影响。

### 安全设计

- 角色永不死亡、饥饿或倒退。
- 不卖皮肤、不掉落装备。
- Buy anyway 不伤害角色。
- 成长来自复盘一致性，现实目标进度仍只来自 allocation。

### 评分

**7.2/10。** 可作为远征地图上的轻量陪伴者，不建议独立成为主循环。

## 5. Option D — Mindful Quest / 轻 RPG 任务

### 机制

- 新购买冲动是 `encounter`。
- 回答必要性、已有替代和预算问题是 quest steps。
- 完成冷静期复盘获得 XP。
- 目标金额形成章节和 boss checkpoint。

### Pros

- “游戏化”最明显，功能天然可以包装成 quest。
- 很适合 tooltip、任务完成动画和演示旁白。
- 可以与 Goal Expedition 组合。

### Cons

- 常见的 XP/level/badge 已广泛用于预算 App，创新性有限。
- 用户可能为了 XP 录入虚假冲动或拆分任务。
- boss、战斗等语言可能把正常消费道德化为敌人。
- 强 RPG 美术容易显得像学生项目而非可信 fintech。

### 安全设计

不使用善恶、胜负或“消费怪物”；称为 reflection quest，不奖励录入数量。

### 评分

**6.8/10。** 适合作为交互语言，不适合作为唯一视觉系统。

## 6. Option E — Garden / 目标花园

### 机制

每个现实目标是一块区域；复盘保持花园活跃，planned allocation 让植物成长并开花。

### Pros

- 平静、无竞争，适合反消费主义。
- 进度变化直观，动画容易制作。
- 不需要复杂叙事。

### Cons

- 市场上非常常见，差异化低。
- 与旅行、活动体验的关系不如路线图直接。
- 若植物枯萎会产生羞辱；若永不变化又缺少动力。
- 视觉容易落入单一绿色环保 App 风格。

### 评分

**6.5/10。** 安全但普通。

## 7. Option F — Memory Constellation / 体验星图

### 机制

用户的目标是一个星座；每个 planned allocation 点亮一颗星，真正完成体验后才把星变成带照片/文字的 memory。

### Pros

- 从“买东西”转向“积累经历”的叙事最纯粹。
- 视觉独特，完成后能形成非物质回忆档案。
- 不需要排行榜或虚拟商品。

### Cons

- 对还债和普通储蓄目标适配较弱。
- 星空视觉容易变成深蓝/紫色单一主题，且实现精致动效需要时间。
- 体验完成发生在比赛之后，demo 主要依赖 seed memory。

### 评分

**7.0/10。** 若产品最终只做体验目标，可升为首选；当前多目标版本不如远征通用。

## 8. 不建议的类型

### Virtual Shopping / 让角色买下用户没买的商品

不建议。它继续把“获得并收藏物品”作为奖励，还可能鼓励用户录入更多商品以扩充虚拟收藏，与反物质主义目标冲突。

### Leaderboards

不建议比较谁“省得更多”或“买得更少”：收入、必要支出、债务与家庭背景不可比，容易造成羞辱或虚假数据。

### Loot Boxes / Random Rewards

明确禁止。随机奖励、稀缺性和倒计时与电商诱发冲动的机制相同。

### Streak Reset

不建议断签清零。可以显示近期复盘一致性，但不能因漏一天抹掉历史进展。

## 9. 推荐组合

### Goal Expedition + Light Quest

主视觉使用现实目标远征，交互使用轻任务语言：

- Dashboard：目的地、路线和现实金额。
- `I'm tempted`：出现一个 decision encounter。
- Review：三步 reflection quest。
- Wait：checkpoint timer。
- Resolve：选择路径，不分善恶。
- Allocate：路线向现实目标推进。
- Reflection XP：只解锁路线故事/洞察，不购买虚拟商品。

可以加入一个极轻量陪伴角色作为路线引导，但不做养成系统。

### 为什么推荐

- 同时有中等偏强游戏感和成熟财务产品可信度。
- 游戏反馈与现实结果一致。
- 能在现有 P0 页面上实现，不需要新增独立 game 页面。
- 三分钟高潮明确：一次购买决定让现实目标路线前进。

## 10. MVP 视觉验收

- 地图/路线必须显示现实目标名称和金额，不能只有 XP。
- pending、reviewed、allocated 三种状态视觉不同。
- Buy anyway 不出现失败、破碎或角色受伤动画。
- planned allocation 明确标记为 planned。
- 里程碑解锁只使用确定反馈，不使用随机奖励。
- 动画时长短，不阻塞下一操作。

---

## 11. Round 2：从“游戏皮肤”拆成三层

会议版与队友 PRD 合并后，游戏化必须拆成：

### Layer A — Behaviour Loop（建议冻结）

```text
Capture temptation
  -> Cool down
  -> Review honestly
  -> Buy / Skip / Extend
  -> Optional planned allocation
  -> Real-goal progress
  -> Later memory / outcome
```

这个循环不因选择地图、花园或角色而改变。

### Layer B — Reward Economy（建议冻结）

系统只保留三种反馈，不建立复杂虚拟货币：

1. **Real Goal Progress**
   - 来源：planned allocation。
   - 用途：推进体验/储蓄/还债目标。
   - 单位：真实货币与目标百分比。

2. **Reflection XP**
   - 来源：按时完成到期复盘，无论 Buy/Skip。
   - 用途：解锁故事、地图细节、洞察或轻量 cosmetic state。
   - 不可兑换商品，不影响目标金额。

3. **Momentum**
   - 来源：最近 7 天按时处理 decision 的比例。
   - 用途：显示习惯稳定性。
   - 不断签清零，不使用 `Don't break your streak`。

禁止第四种 token、coin、gem 或 shop。两套进度（现实目标 + XP）已经足够，再增加货币会让用户混淆并复制游戏消费经济。

### Layer C — Presentation Theme（唯一待选）

主题只决定同一状态如何呈现，不改变 XP、金额或 decision rules。

## 12. 当前三个最终候选

### Finalist A — Goal Campaign Map（推荐）

#### 概念

每个现实目标是一场 campaign，路线节点不是虚构关卡，而是目标的真实组成部分。

Japan Trip 示例：

```text
Passport -> Flight -> 2 Hostel Nights -> Rail Pass -> Museum Day
```

`$180 sneakers` 的 planned allocation 不只是让进度从 62% 到 66%，而是具体覆盖 `one hostel night + half a rail pass`。这同时完成 opportunity cost、experience conversion 和游戏反馈。

储蓄目标：

```text
$250 buffer -> 1 week essentials -> 1 month runway -> target
```

还债目标：

```text
First $500 -> interest checkpoint -> halfway -> final balance
```

#### 游戏语言

- 新冲动：`Decision encounter`
- 冷静期：`Pause checkpoint`
- 到期：`Choice ready`
- Planned allocation：`Advance campaign`
- 目标节点：`Milestone`
- 完成体验：`Memory unlocked`

不使用 monster、boss、fight 或 defeat，避免把正常消费道德化为敌人。

#### P0 视觉

- Dashboard 顶部是一条稳定高度的横向路线。
- 5 个节点；当前节点有低幅度 motion pulse。
- planned allocation 后，路径填充并移动 marker。
- 节点弹出真实成本与意义。
- Reflection XP 只改变 marker 的小细节/路线注释，不改变钱。

#### 优势

- 最能可视化 Lemonade 的真正差异：具体体验转换。
- 对体验、储蓄和还债均可参数化。
- DOM + CSS path + Motion 即可，不需要游戏引擎。
- 评委一眼能看到选择如何转成更想要的生活。
- 资产需求最低，最适合剩余时间。

#### 风险

- 如果节点只是抽象圆点，会退化成漂亮进度条。
- 节点成本必须是 seed/planned，不可假装真实预订价格。
- 多目标适配需要不同 milestone 文案，但不需要不同代码。

### Finalist B — Living World / 理想生活微缩世界

#### 概念

用户选择的目标对应一个小型场景。planned allocation 增加永久环境变化：旅行目标出现车站、帐篷、朋友和目的地；储蓄目标让基地从临时变稳定；还债逐步清除遮挡与噪声。

#### P0 视觉

- 一个固定比例的 2D 场景。
- 3–4 个 milestone layer，按目标进度淡入。
- allocation 后场景加入一个 meaningful element。
- 可用 imagegen 生成一致资产，再用 Motion 分层出现。

#### 优势

- 视觉 wow 最强。
- `watch your world grow` 可以保留队友 PRD 的核心语言。
- 适合 Lemonade 的 gain framing。

#### 风险

- 资产、分层、响应式和动画成本最高。
- 很容易变成“解锁更多虚拟物品”，与反物质主义冲突。
- 金额与场景变化之间不如 Campaign Map 可解释。
- 体验/储蓄/还债需要三套不同场景资产。

#### 安全边界

解锁的是地点、人物、活动和稳定性，不是家具商城、皮肤或收藏品。

### Finalist C — Companion Journey / 陪伴者旅程

#### 概念

一个轻量 companion 陪用户完成复盘并走向现实目标。它不拥有物品、不饿、不死、不因用户购买而受伤。

#### P0 视觉

- Dashboard 有 companion 和目标背景。
- 完成复盘后 companion 获得新动作/表情。
- allocation 后 companion 沿路线移动或到达新场景。
- Buy anyway 时保持中性并显示 `Decision made mindfully`。

#### 优势

- 情感留存可能最强。
- 可承接团队提出的角色方案。
- 角色能把直接/温柔/幽默 coaching tone 视觉化。

#### 风险

- 非常容易儿童化或 Tamagotchi 化。
- 角色成长若绑定 Skip，会形成羞耻与刷分。
- 需要更多角色状态和动画。
- 对 Technical Complexity 的贡献不如规则引擎本身。

#### 最合理定位

不是独立模式，而是未来叠加在 Campaign Map 上的 narrator/marker。

## 13. 推荐组合：Campaign Map + 轻量 Companion Marker

不是同时做两个系统：

- **Campaign Map** 是主游戏结构。
- 一个极简角色/柠檬形 marker 只负责在路径上移动和表达 coaching tone。
- 不做喂养、装备、皮肤商店或角色等级页。

### P0 游戏状态映射

| 产品事件 | 游戏反馈 |
|---|---|
| Capture | 创建一个 decision encounter，不发 XP |
| Start cooling | encounter 停在 pause checkpoint |
| Review when ready | +Reflection XP，显示一次确定反馈 |
| Buy | encounter 归档，地图不倒退 |
| Skip | 显示 `Available to redirect`，地图仍不动 |
| Allocate | 目标路线按金额推进 |
| Goal milestone | 节点点亮，显示现实意义 |
| Complete experience | 用户确认后生成 memory 节点 |

### 为什么最适合 Lemonade

1. 把 gain framing 做成实际交互，而不只是一句 slogan。
2. 机会成本不再是静态文字，而是路线节点的转换。
3. 没有惩罚购买，也没有虚拟商品囤积。
4. 三分钟 demo 的高潮是可见的地图推进。
5. 游戏主题稍后换皮也不影响底层 engine。

## 14. 需要团队选择的三个视觉参数

在开始生成资产前，只需确认：

1. **Tone**：清爽成熟 / cozy playful / adventure energetic。
2. **Marker**：纯路线指针 / 抽象 lemon icon / 有表情的轻量 companion。
3. **Map style**：现实 itinerary / 手绘探索地图 / 极简 milestone track。

其余机制已经可以冻结，不应继续开放讨论。

---

## 15. Round 3：游戏化目标上调并冻结为 7/10

### 7/10 在本项目中的定义

`7/10` 不是“多做一点动画”，而是多个游戏系统形成持续闭环：

```text
Decision encounter
  -> Reflection quest
  -> XP / level
  -> Planned resource allocation
  -> Campaign milestone
  -> World / marker change
```

用户可以描述自己“正在推进一场 campaign”，而不只是“看一个预算进度条”。与此同时，所有进展仍由现实行为触发，游戏不能脱离消费管理独立刷取。

### 类型名称

> **Light resource-management + journey-progression game**

中文：**轻量资源管理 + 旅程养成游戏**。

它位于预算工具和完整模拟经营游戏之间：

- 比普通 gamified dashboard 更强：有 encounter、quest、等级、资源配置和持续世界状态。
- 比完整游戏更轻：无战斗、角色数值 build、随机掉落、虚拟经济或实时操作。

### 从 6/10 升到 7/10 必须增加的核心

#### 1. Meaningful Allocation Choice

用户 Skip `$180 sneakers` 后，不是直接播放进度动画，而是在两个真实目标组件之间选择：

```text
Allocate $180 to:
[ One hostel night ]
[ 45% of the rail pass ]
```

这个选择会改变哪条路线节点被填充。它是轻量资源管理的核心，也是 opportunity-cost engine 的交互化。

#### 2. Persistent Player Progression

Reflection XP 形成 4 个轻量等级，例如：

```text
Level 1  Noticer
Level 2  Navigator
Level 3  Planner
Level 4  Pathfinder
```

等级只解锁地图注释、回顾洞察或视觉细节，不提供“更容易赚钱”等财务优势。

#### 3. Quest Board

P0 只做 3 个过程型 quest：

- `Clear one ready decision`
- `Find an alternative in My Stuff`
- `Plan one contribution to your campaign`

禁止 `Skip 5 purchases`、`No takeaway week` 等结果型/剥夺型任务。

#### 4. Persistent World Feedback

- Campaign map 记录每个 milestone 的 planned amount。
- Marker/轻量 companion 沿路线移动。
- 到达 milestone 时出现短 ceremony 和现实意义。
- Buy anyway 后 encounter 被归档，世界不倒退。

### P0 游戏状态

| 系统 | P0 内容 | 数据来源 |
|---|---|---|
| Campaign | Japan Trip + 5 milestones | Goal + planned allocations |
| Encounter | Cooling/ready decision cards | PurchaseDecision |
| Resource | Planned AUD，只能来自 skipped decision | Allocation |
| XP | Review-ready decision 后获得 | Resolution event |
| Levels | 4 个固定阈值 | XP total |
| Quests | 3 个一次性/可重置任务 | Domain events |
| Momentum | 7 日复盘率 | Decision timestamps |
| World | 路径、marker、节点 ceremony | Campaign state |

### 仍然不做（8/10 以上功能）

- 可购买或可兑换的 virtual currency。
- 角色装备、属性 build、技能树。
- 战斗、小游戏或实时操作关卡。
- 完整 city/island builder。
- 随机 reward/loot box。
- 排行榜、PvP 或多人同步。
- 数十个 achievements 与 daily grind。

### 7/10 Demo 高潮

1. 用户完成一个到期 decision，获得 `+20 Reflection XP`，等级从 Noticer 向 Navigator 推进。
2. 选择 Skip，但地图不动。
3. Allocation sheet 给出两个现实选项：hostel 或 rail pass。
4. 用户选择 hostel，`$180` token/amount 被配置到该节点。
5. 路线填充、marker 移动、Hostel milestone 出现 ceremony。
6. Quest `Plan one campaign contribution` 完成。

在 15–20 秒内，XP、资源选择、地图和 quest 四个系统联动，这才达到可感知的 7/10。

### 工作量控制

优先级：

1. Campaign + allocation choice。
2. XP + 4 levels。
3. 3 quests。
4. Marker + milestone ceremony。
5. Momentum。

如果时间不足，先砍 Momentum 和 companion 表情，不砍 resource allocation；否则会重新掉回“动画进度条”。

---

## 16. Round 4：接受质疑——Campaign Map 单独只有 4–5/10

### 为什么前一版不够

Campaign Map 有反馈和持续进度，但玩家并没有真正“玩”：

- 没有需要掌握的规则。
- 没有会限制选择的空间/资源系统。
- 没有操作技巧或策略差异。
- 结果基本由金额自动决定。
- 反复使用时只是在重复播放同一进度动画。

因此它最多是 meta progression，不应作为核心玩法。目标 7/10 要求至少加入一种真正的 interaction mechanic。

## 17. 可达到 7/10 的五种核心玩法

### Option 1 — Budget Packing Puzzle（新首选）

#### 类型

空间资源配置 / packing puzzle。

#### 核心隐喻

每月 wants budget 是一个容量有限的 board/suitcase。商品、体验和目标贡献都是按金额占空间的块。

示例：board 每格代表 `$20`，本月可支配 wants budget 为 `$600`。

```text
[ Hostel $180 ][ Rail pass $120 ][ Friends $80 ][ Free $220 ]
```

一双 `$180 sneakers` 进入 cooling tray。到期后，用户若要把它放入 board，就必须亲手移走同样大小的 hostel/rail-pass 空间；如果 Skip，则可以把空出的块配置给目标。

#### 真正玩法

- 有固定容量。
- 块大小由价格决定。
- 部分目标块可以拆分，部分 milestone 必须完整填充。
- 用户通过 click-select/place 或 drag-and-drop 重排。
- 不存在“完美答案”，只是让取舍变得不可忽视。

#### Demo 高潮

1. `$180 sneakers` 块出现在 Cooling Tray。
2. 用户尝试放入已经接近满载的 Monthly Board。
3. Board 高亮显示它会挤掉 `one hostel night`。
4. 用户撤回鞋块，选择把 `$180` 放入 Hostel milestone。
5. Hostel 块锁定为 planned，出现轻量 milestone feedback。

#### Pros

- 机会成本从文字变成可玩的空间冲突。
- 玩法一眼可懂，明显不只是进度条。
- 与预算管理天然一致，不需要虚构敌人或战斗。
- Buy 仍然是合法选择，只是必须接受真实 trade-off。
- 可以反复用于每月规划。
- 使用 CSS Grid + Motion 即可；P0 不一定需要拖拽库。

#### Cons

- 金额必须取整到格子单位，例如 `$20`，要显示 rounding。
- 手机拖拽可用性差，必须支持点击选择后放置。
- 若所有目标块都可随意拆分，拼图策略会变弱。
- 容易被误解为 envelope budgeting，需要强调 cooling item 的空间碰撞。

#### 实现建议

- P0 使用 click-to-place，不依赖拖拽。
- 固定 `6 x 5` grid，每格 `$20`。
- 三种 block：goal、experience、want。
- 用 stable grid dimensions，避免动态内容改变布局。
- Campaign Map 可作为完成 board 操作后的 secondary feedback，而非核心。

### Option 2 — Life Draft / 人生卡牌选秀

#### 类型

Card drafting + limited slots。

#### 核心玩法

用户每周只有固定数量的 discretionary slots。Cooling 到期的 want、体验计划、储蓄/还债贡献都成为卡牌；用户从手牌中选择哪些进入本周/month plan。

卡牌包含：

- cost；
- category；
- goal contribution；
- owned overlap；
- urgency expiry；
- long-term value prompt。

#### Demo 高潮

用户有 5 张候选卡但只能选择 3 张：sneakers、hostel、rail pass、friend dinner、debt contribution。选择 sneaker 会占用两个 slots，并使某个体验组合无法完成。

#### Pros

- 卡牌交互成熟、动画容易、移动端友好。
- 选择和组合比进度条更有游戏感。
- 可以做每周 draft，具备重复性。
- 实现成本低于 packing grid。

#### Cons

- slot 数量与真实金额的关系不如 grid 精确。
- 商品卡牌收藏感可能继续强化物品关注。
- 若“体验卡总比商品卡好”，选择会显得被操纵。
- 需要非常克制地处理卡牌稀有度；建议完全不用 rarity。

### Option 3 — Experience Itinerary Builder / 体验规划模拟

#### 类型

轻量规划模拟 / constraint-based management。

#### 核心玩法

用户用 planned budget、时间和同伴偏好组装一场真实体验。每次不购买不是简单加进度，而是增加可用于住宿、交通和活动的规划资源。

约束：

- budget；
- available days；
- transport time；
- friend availability；
- preferred activity type。

#### Demo 高潮

Skip `$180 sneakers` 后，用户在 Japan itinerary 中选择：升级住宿、加入 rail pass 或安排 museum day；不同组合影响总预算与行程冲突。

#### Pros

- “spend on moments, not stuff” 真正成为玩法。
- 策略和现实价值最强。
- 视觉和 pitch 都很独特。

#### Cons

- 只适合体验目标，对 savings/debt 支持弱。
- 会把产品重心从消费干预转成旅行规划。
- 数据与 UI 复杂，24 小时风险最高。
- 容易需要地图、地点和价格数据，当前只能 seed。

### Option 4 — Decision Deck / 决策工具牌

#### 类型

轻量卡牌策略 / evidence-building game。

#### 核心玩法

每个 impulse encounter 有若干未知或未考虑的信息。用户从有限的 reflection actions 中选择 2–3 个：

- `Check My Stuff`
- `See Goal Trade-off`
- `Wait 24h`
- `Check Frequency`
- `Ask Replacement Reason`

每张工具牌揭示不同证据，用户随后自己决定。

#### Pros

- 把干预问题变成主动探索，而不是被动读提醒。
- 直接复用现有 overlap/opportunity-cost/frequency engine。
- 实现成本可控。
- 用户决定查看什么，增强 autonomy。

#### Cons

- “限制只能看两条证据”在真实金融工具中不合理。
- 若系统有隐藏正确答案，会变成道德测验。
- 可重复性有限，几次后用户会形成固定顺序。
- 更适合作为 Capture/Review 的微交互，不适合完整主游戏。

### Option 5 — Living World Management / 微型世界管理

#### 类型

Idle builder / management-lite。

#### 核心玩法

用户在有限资源下选择发展世界的哪些区域：connections、adventure、security、learning。现实目标决定区域；planned allocation 提供资源，Reflection XP 提供解锁。

#### Pros

- 视觉和长期留存上限最高。
- 可表现不同生活价值，而非单一旅行。
- 具备真实 build choice 时，不只是自动长大的世界。

#### Cons

- 最容易变成虚拟物品收藏。
- 资产量与状态组合远超剩余时间。
- 世界资源与真实金额之间容易失真。
- 需要完整 balancing，否则选择没有策略意义。

## 18. 重新排序

| 核心玩法 | 真正可玩性 | 与产品一致 | 24h 可行 | Demo | 综合 |
|---|---:|---:|---:|---:|---:|
| Budget Packing Puzzle | 8 | 9 | 7 | 9 | **8.3** |
| Life Draft | 7 | 7 | 9 | 8 | **7.7** |
| Decision Deck | 6 | 8 | 8 | 7 | **7.2** |
| Itinerary Builder | 8 | 9 | 4 | 9 | **7.1** |
| Living World Management | 8 | 6 | 3 | 9 | **6.4** |

评分只用于当前约束下比较，不代表长期产品价值。

## 19. 新推荐结构

```text
Core gameplay: Budget Packing Puzzle
Meta progression: Goal Campaign / levels
Micro interaction: one Decision Deck prompt
Cosmetic feedback: optional marker/companion
```

游戏化的主体变成“有限 wants budget 中的空间配置”，地图只负责长期 meta feedback。这样既不是换皮进度条，也不需要开发完整模拟经营游戏。
