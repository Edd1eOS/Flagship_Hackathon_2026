# PRD：Lemonade

> 版本：v0.2  
> 状态：冲突已合并，可作为唯一开发规格  
> Tagline：Spend on moments, not stuff.  
> 产品语言：演示界面默认英文

## 1. Product Summary

Lemonade 把“没有买下一个东西”从损失重构为一次交换：用户在冲动购买发生时暂停、检查和重新选择，再把确认未消费的预算导向体验、储蓄或还债目标。奖励不是忍耐本身，而是一个更想要的现实生活正在接近。

它不是普通记账工具，也不以“禁止消费”为目标。核心区别是：

1. 在消费前而非消费后介入。
2. 检查用户是否已有功能相似物品。
3. 对“想要类”购买增加反思与冷静期。
4. 将未购买后的正反馈连接到用户真正重视的目标。

### Elevator Pitch

> Lemonade turns an impulse purchase into progress toward a life you actually want. It helps you pause, shows what you already own and what that money could become, then makes the better alternative feel like a gain rather than a sacrifice.

### 核心 Reframe

不是 `stop buying`，而是 `trade low-value stuff for a higher-value life`。体验是 demo 的主要叙事，但产品同样允许用户把选择导向储蓄或还债，避免把所有人重新推向另一种消费。

## 2. Problem

传统预算 App 主要记录已经发生的交易，无法处理购买冲动最强的决策瞬间。电商则通过低摩擦付款、限时优惠和推荐不断缩短思考时间。

用户可能知道自己正在冲动消费，但缺少三个东西：

- 一个在付款前触发的低摩擦暂停机制；
- 对“我是否已经有类似物”的具体反馈；
- 一个比“什么都不买”更有吸引力的替代结果。

Lemonade 不再声称“没有任何 App 在购买前介入”。HoldUp、Forgo、BuyBye 等直接竞品已覆盖冷静期、机会成本、skip tracking 或目标映射。Lemonade 的具体差异是：

1. 同时展示用户已经拥有、可满足相同用途的物品。
2. 把金额转换成一个具体体验/储蓄/还债里程碑，而非只累计“没有花的钱”。
3. 只有用户确认 planned allocation 才推进目标，避免虚构 savings。
4. 游戏反馈不惩罚仍然购买的诚实决定。

## 3. Target User

### MVP 主用户（已冻结）

18–30 岁的学生或年轻成年人：

- 有有限的 discretionary budget；
- 会在线购买衣物、鞋、配饰或生活方式商品；
- 有旅行、活动、储蓄或还债目标；
- 偶尔意识到重复购买或冲动购买，但不会长期坚持复杂记账。

### 本次不覆盖

- 儿童理财教育：涉及家长控制、年龄适配与不同 UX。
- 严重消费成瘾或临床问题：产品不是医疗工具。
- 完整债务管理用户：MVP 只把还债作为一种目标，不计算利率或提供金融建议。

## 4. Product Principles

1. **Pause, do not punish.** 增加反思，不羞辱或强制阻止用户。
2. **Needs remain flexible.** 必要消费不受固定数量限制；“想要类”才进入额度与冷静期。
3. **Reward progress, not deprivation.** 奖励目标进展与完成复盘，不把痛苦忍耐包装成道德优越。
4. **No fake impact.** 只区分 `considered / waiting / bought / skipped / allocated`，不把点击按钮等同于真实节省。
5. **One useful loop before a full dashboard.** 每个模块必须服务核心行为闭环。

## 4.1 Visual Personality（已确认方向）

产品视觉以 `docs/style.png` 为基准：手绘编辑感、粗描边 sticker illustration、明亮柠檬色与绿色、友好但不幼稚。

- 手写/圆润 display font 只用于品牌、页面标题、milestone 和短反馈。
- 正文、金额、计时器、表单与数据使用清晰 sans-serif。
- 手绘插画用于 game pieces、目标节点和情绪反馈；操作按钮仍使用标准 Lucide 图标。
- 白色作为主底色，暖奶油色只作局部形状/分区；避免低对比、全页米色。
- 柠檬黄为品牌强调色，搭配叶绿、珊瑚红、天空蓝和深墨色，不做单一黄绿主题。
- 圆角控制在 6–8px，游戏块可用更强的 sticker outline，但普通页面 section 不做浮动卡片堆叠。
- 动画使用贴纸放置、轻微 squash/snap、路径填充和短 sparkle；不使用持续漂浮、bokeh、渐变球或大面积 confetti。

## 5. Core User Journey

### Step 1 — Set one priority

首次进入选择一个主目标：

- Experience：旅行、演出、朋友活动等。
- Savings：紧急储蓄或具体储蓄目标。
- Debt：把可支配金额优先分配给还债。

输入目标名称、目标金额、当前进度和每月 wants budget。演示版提供预置账号，也允许快速编辑。

P0 使用短表单；P1 的 AI onboarding 只能生成建议预算、默认类别和 coaching tone，用户必须确认后才保存。

### Step 2 — Capture an impulse

用户点击 `I'm tempted`，输入或上传：

- 商品名称；
- 价格；
- 分类；
- 商品图片；
- 为什么想买：need / replacement / occasion / mood / sale / trend；
- 是否存在限时优惠。

P0 使用表单和样例商品；P1 可用 Groq 从图片抽取名称、分类、颜色和基础属性。

创建后进入 `Cooling List`。Lemonade 不售卖商品，也无法阻止用户在外部商店付款；24 小时冷静期是用户自愿的 decision commitment，不是技术支付锁。

### Step 3 — Intervention

系统依次给出少量、可回答的干预：

1. `Is this a need, a replacement, or a want?`
2. 与 `My Stuff` 比对，显示最多 3 件可能已满足同一用途的物品。
3. 显示本月 wants budget 在购买后的状态。
4. 将目标进行具体对比，例如：`This is 4% of your Japan trip` 或 `one hostel night`。
5. 给出真实的频率洞察，例如：`This is your third fashion consideration this month`，数字必须来自本地 decision history。

低置信度时说 `possible overlap`，不假装完全理解用户需求。

### Step 4 — Cooling period

对 want/duplicate-risk 商品提供：

- `Wait 24 hours`：进入 pending list。
- `Buy anyway`：允许继续并记录理由，不扣道德分。
- `It's necessary`：重新分类为 need，并要求一句原因。

演示使用一条新建 pending item 和一条 24 小时前的 seed pending item，避免伪装时间已经过去。

### Step 5 — Resolve and redirect

冷静期后询问：

- Still want it?
- Bought it / Skip it / Keep waiting。

选择 Skip 后，金额先标记为 `available to redirect`，用户再选择：

- Allocate to experience goal；
- Allocate to savings；
- Allocate to debt goal；
- Do not allocate。

只有明确选择 Allocate，目标进度才增加。演示版不移动真实资金，并应标注 `planned allocation`。

### Step 6 — Game feedback

目标进度通过尚待团队选择的 game layer 反馈，而非随机积分商城。无论最终选择旅程地图、世界建造或陪伴角色，都必须遵守：

- 旅行目标可以解锁路线节点或现实准备里程碑；
- 活动目标可以逐步完成准备清单；
- 储蓄/还债使用清晰里程碑；
- Buy anyway 不造成枯萎、受伤、倒退或失败动画；
- streak 不因漏一天清空历史成果。

用户即使选择 Buy anyway，也可以因完成复盘获得小量 `reflection XP`；只有 Allocate 才推进金钱目标。这样避免惩罚诚实记录，也避免通过不断录入购买冲动刷分。

## 6. Information Architecture

### P0 页面

1. **Dashboard**
   - 主目标与进度；
   - 本月 wants budget；
   - pending decisions；
   - `I'm tempted` 主操作；
   - 最近一次目标进展。

2. **Capture / Review Flow**
   - 商品输入；
   - need/want 分类；
   - My Stuff overlap；
   - 预算/目标对比；
   - Wait / Buy anyway。

3. **Pending Decision Detail**
   - 冷静期剩余；
   - 原始购买理由；
   - 已有替代品；
   - 到期后的 Resolve 操作。

4. **My Stuff**
   - 8–12 件 seed 物品；
   - 名称、类别、颜色、用途标签；
   - 简单新增/删除；
   - 不做全量衣橱管理。

5. **Goal Detail**
   - 目标进度与里程碑；
   - planned allocations；
   - 与跳过购买的关联记录。

### P1

- Groq 图片属性抽取。
- 基于 category/colour/use tags 的可解释 overlap score。
- 一个体验替代推荐卡，例如用现有预算与朋友完成的具体活动。
- 简单设置 drawer：预算、提醒、目标编辑。
- 可选 AI onboarding：输出建议，必须由用户确认。

### P2 / Future

- WXT 浏览器扩展或移动 share sheet。
- 银行 open banking 连接与真实交易核对。
- 二手替代品聚合。
- 本地体验搜索与预订。
- 动态冷静期和长期行为个性化。
- 多目标、家庭模式、儿童版。
- 证据化 weekly AI coach 与真实 push notifications。
- Friend/shared goals、排行榜或社交挑战。

## 7. Gamification Design

### 游戏化目标（已冻结）

目标强度为 **7/10**。准确类型是：

> A browser companion and real-world mission simulation embedded at the online-shopping moment.

中文：嵌入网购现场的浏览器陪伴宠物与现实 reuse/repair 任务模拟。

核心游戏是 **Lemonade Lane town-management dashboard + Lemonade Browser Scout**。WXT content script 在高置信度商品页注入一只克制的 Pocket Mouse 浮窗；它检测购买意图、带回同用途 My Stuff 提醒，并把商品带回网站。返回网站后，同一只 Scout 从 Browser Gate 跳回 Lemonade Lane；Cooling/mission、居民分配与地点活动继续在小镇仪表盘中完成。

游戏不读取 `Skip amount` 发币，也不要求用户为了照顾宠物而持续录入冲动。主要状态是：

- Companion：`hidden -> peeking -> prompting -> comparing -> mission_offer -> cooling -> ready -> reflecting -> home`；
- Mission：`offered -> accepted -> active -> ready_for_checkin -> completed/cancelled`；
- Decision 继续使用原有 `draft/assessed/cooling/ready/bought/skipped/extended` 业务状态机。

宠物有两个 mission slots；同一 PurchaseDecision 在 P0 只能连接一个 active mission，同一 OwnedItem 不能同时参与冲突任务。小镇另有 Mender/Host 两名可分配居民，三类 project eligibility 与有限居民调度继续保留。Scout 不占居民行动名额，避免让购物检测与小镇经营竞争。任务准备状态来自真实 timestamp/checklist，而非动画。Reflection XP 固定，不取决于 Buy/Skip 或商品价格。

### P0 机制

- **Product detection：** controlled storefront + high-confidence generic JSON-LD Product/Offer；低置信度不自动弹窗。
- **Floating companion：** 商品页安静 peeking；Add to Cart intent 时提供 `Pause with Lemonade / Continue anyway`。
- **Same-job comparison：** 小鼠展示能满足相同真实用途的已有物品，而不只比较商品类别。
- **Concrete mission：** 至少实现 `TRY_EXISTING` 或 `REPAIR`，让 Cooling 包含现实行动而非纯倒计时。
- **Mission check-in：** Ready 时询问任务是否解决原始需求，再提供 Use existing / Repair / Buy / Extend。
- **Town projects：** Reflection/ReuseCommitment/PlannedAllocation 继续使 Picnic/Workshop/Station 项目 available；两名居民每周期各负责一个项目。
- **Scout return：** Extension handoff 持久化后，Scout 携带商品从 Browser Gate 跳回 Home cooler；动画不拥有业务状态。
- **Reflection XP：** 完成一次到期复盘获得固定 XP，不取决于是否购买或商品价格；同一 decision 只奖励一次。
- **Town feedback：** 根据已确认的 reflection/reuse/allocation 激活居民活动和地点 lived-in 状态；不按 Skip 金额自动升级建筑。
- **Optional allocation：** 仍允许 planned allocation/postcard，但不再是成功定义或 Demo 主高潮。
- **Non-punitive feedback：** Buy anyway 不使世界枯萎、不伤害角色、不清空进度。

### 禁止机制

- 不为录入更多想买物品发奖励。
- 不用 loot box、随机奖励或稀缺倒计时复制消费操纵。
- 不建立无限虚拟商品商城；P0 只允许固定里程碑装饰三选一。
- 不设置“买了就失败”或公开羞辱。
- 不把累计 Skip 金额直接称为 bank savings。
- 不做宏大城市、道路/税收/人口、饥饿/健康衰退、系统级桌面悬浮窗或完整 Tamagotchi 经济。

### 角色与 Home

Pocket Mouse 是产品入口和跨页面主角，不是无关吉祥物：Scout 在购物页面出现并把商品带回小镇；Home Nook、Workshop、Picnic 与 Station 用旧茶杯、瓶盖和碎布构成。Scout 负责巡逻与决策连续性，Mender/Host 负责小镇项目，不提供商城。

完整业务规则见 `docs/10-business-and-game-logic.md`；浏览器 Scout 细节见 `docs/12-browser-companion-pivot.md`；最终小镇 Dashboard 布局、角色职责、返回动画与 P0 UI 以 `docs/13-town-dashboard-uiux.md` 为准。

## 8. Functional Requirements

### FR1 — Budget and Goal

- 用户可设置 monthly wants budget。
- 用户可设置一个主目标和当前/目标金额。
- planned allocation 可增加目标进度，并保留来源 decision ID。

### FR2 — Library

- 可展示、新增和删除物品。
- 每件物品有 category、colour 和 use tags。
- overlap 必须显示匹配理由，不只给一个神秘分数。

界面和文案统一将此模块称为 `My Stuff`；`Cooling List`/`Decisions` 是另一个数据集合。

### FR3 — Purchase Decision

- 可创建 purchase consideration。
- 可分类 need/want/replacement。
- want 可以进入 cooling period。
- 所有 decision 都有状态和时间戳。
- 系统可根据本地 decision history 显示可验证的 category frequency insight。

### FR4 — Resolution

- 到期 item 可 Buy / Skip / Extend。
- Skip 不自动改变目标金额。
- Allocate 后目标金额与事件日志同步更新。

### FR5 — Demo Reliability

- 有 seed account、新建流程、24 小时前的 pending item。
- 所有 AI 调用有 loading、timeout、retry 和 fallback。
- 一键 Reset Demo。
- 不需要登录即可完成主路径。

## 9. Data Model

```ts
type Goal = {
  id: string;
  type: 'experience' | 'savings' | 'debt';
  name: string;
  targetAmount: number;
  currentAmount: number;
};

type OwnedItem = {
  id: string;
  name: string;
  image: string;
  category: string;
  colour: string;
  useTags: string[];
};

type PurchaseDecision = {
  id: string;
  name: string;
  image?: string;
  price: number;
  category: string;
  motive: 'need' | 'replacement' | 'occasion' | 'mood' | 'sale' | 'trend';
  status: 'considering' | 'waiting' | 'bought' | 'skipped' | 'extended';
  createdAt: string;
  reviewAt?: string;
  overlapItemIds: string[];
  resolutionReason?: string;
};

type Allocation = {
  id: string;
  decisionId: string;
  goalId: string;
  amount: number;
  kind: 'planned';
  createdAt: string;
};
```

## 10. Technical Approach

- pnpm workspace：`apps/web` 使用 Next.js App Router + React + TypeScript；`apps/extension` 使用 WXT；二者共享 `packages/domain`，世界模拟位于独立的 `packages/game-engine`。
- Web UI 使用 Tailwind、按需 shadcn/Radix、Lucide 与 Motion；Lemonade Lane 使用固定比例 DOM 分层场景和完整 raster state assets，不引入 Phaser/Pixi/Three。
- Zustand 单一 root store 持久化 business/world/event log；纯 TypeScript command handler、decision state machine、idempotent event projector 与 resident scheduler 负责核心规则，React 组件不可直接加 XP、目标金额或解锁地点。
- Vercel 部署；seed JSON + localStorage；不引入 Supabase、认证和真实银行数据。
- WXT content script 作为 P1 购物拦截入口，通过 JSON-LD/OpenGraph 识别商品并跳转到预填 Capture；不复制网站的游戏状态。
- Groq 只用于 P1 图片属性抽取；Zod 校验输出并保留完整手动 fallback。AI 不判断 necessity、购买结论、overlap 或游戏资格。
- P0 overlap 使用 category/use tag 等可解释规则，不依赖 embedding 服务。
- Vitest 测业务和模拟引擎不变量；Playwright 测完整 Desktop/Mobile/Reduced-motion Demo 路径与视觉状态。
- 所有金额使用 AUD，并明确区分 self-reported price、available to redirect 与 planned allocation。

完整目录、依赖、引擎算法、扩展、资产渲染、测试和降级顺序以 `docs/05-build-stack-and-tools.md` 为准。

## 11. Metrics

### North Star

`resolved skipped wants that receive a planned allocation / resolved want decisions`

它衡量完整闭环，但仍只是 planned behavior，不等于真实银行转账。

### Supporting

- cooling period completion rate；
- duplicate-risk items identified；
- decision outcome distribution；
- planned amount redirected by goal type；
- pending decisions resolved on time。

### Guardrails

- Buy anyway 后的羞耻/退出反馈；
- need 被错误拦截率；
- overlap 建议被标记不相关的比例；
- 用户为获得游戏奖励而虚假录入的比例。

## 12. Non-Goals

- 不提供金融、债务或投资建议。
- 不声称真实移动或节省资金。
- 不诊断购物成瘾。
- 不承诺准确识别所有已有物品。
- 不做碳排精确计算器。
- 不建立新的商品或体验 marketplace。
- 不声称能够锁住、延迟或取消外部商店支付。
- 不声称 cool-off、opportunity cost 或 skip tracking 本身为市场首创。

## 13. Acceptance Criteria

- 新用户可在 60 秒内看到 seed dashboard 并开始一次购买决策。
- 从 Capture 到 Wait 不超过 90 秒。
- 至少一个商品能找到 2–3 个带理由的 Library overlap。
- 可现场创建 waiting decision。
- 可打开 seed expired decision，完成 Skip -> Allocate -> Goal progress 更新。
- Buy anyway 路径完整且无羞辱性文案。
- API 断开时主 demo 仍可运行。
- 桌面与移动 viewport 无内容重叠或按钮溢出。
- GitHub、deployed website 和 3 分钟视频在截止前可访问。

## 14. Three-Minute Demo Outline

1. **0:00–0:25 Problem**：多数预算工具解释已经发生的消费；Lemonade 为眼前这次决定而设计。
2. **0:25–0:55 Goal**：展示朋友旅行目标与 monthly wants budget。
3. **0:55–1:35 Capture**：录入一双 `$180` 鞋，显示已有相似鞋、第三次 fashion consideration、预算影响和 Japan trip 占比。
4. **1:35–1:55 Pause**：选择 Wait 24 hours，解释不禁止购买。
5. **1:55–2:30 Resolve**：明确切换到昨天的 seed decision，选择 Skip，再确认 `Plan $180 toward Japan`。
6. **2:30–2:50 Game feedback**：旅程地图推进、里程碑解锁。
7. **2:50–3:00 Close**：`Less stuff is not the reward. More life is.` / `Spend on moments, not stuff.`

## 15. Open Questions

- 游戏视觉使用旅程地图还是角色成长。
- wants budget 是金额、件数还是两者；建议 MVP 只用金额。
- 是否允许用户将同一笔 planned allocation 拆给多个目标；建议 MVP 不允许。
- 体验推荐是否进入 P1；必须在 P0 稳定后决定。
