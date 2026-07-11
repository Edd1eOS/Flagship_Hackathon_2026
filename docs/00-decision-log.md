# 项目决策日志

> 当前版本：v1.0  
> 日期：2026-07-11  
> 目的：保留必要决策与依据，替代已经删除的阶段性脑暴和排序文档。

## 1. 题目

> Develop a technical solution that meaningfully reduces consumerism/materialism in everyday life.

团队将题目理解为：不仅改善回收，还应在购买前减少非必要消费、延长已有物使用，或把资源转向更有价值的目标。

## 2. 原始输入

原始队员方案继续保存在：

- `idea_philips.md`：用时限和承诺减少闲置物处置拖延。
- `idea_mateen.md`：可信校园环境中的旧科技设备流转。
- `idea_Kat`：用体验替代物品礼物，把消费转向体验。
- `idea_areez.md`：通过维修/升级延长设备寿命。
- Eddie/Xinxiang 方向：用已有物品对比拦截重复购买。

## 3. 已完成的压力测试结论

- 单纯数字衣橱、AI 建库和穿搭推荐已有大量产品，不能作为核心创新。
- “自动捐赠”若没有取件、质检和接收机构，无法由软件履约。
- 维修方向有价值，但实时 AI 拆机指导存在安全和准确性风险。
- 校园设备流转依赖机构验机和交接；UNSW 已有 Arc eReuse，因此不能重复做普通 listing 平台。
- 体验礼物 registry 已有产品，不能只做另一张体验清单。
- 点击一次 `Skip` 不能立即算作真实节省；应在冷静期结束、用户确认未购买后记录，并区分“确认未花”和“实际转入目标”。

## 4. 2026-07-11 团队会议形成的新方向

### 产品定义

一个面向消费习惯管理与体验消费引导的游戏化预算应用：

- 用预算与“想要类”额度显化消费边界。
- 用户在购买前录入想买物品。
- 系统判断必要性、重复性和冲动风险，并进入冷静期。
- 使用个人物品库提示已有替代品。
- 用户重新决策后，可将确认未消费的金额分配给体验、储蓄或还债目标。
- 游戏化反馈把即时满足从“获得商品”转到“目标进展与更有意义的生活计划”。

### 融合来源

| 当前机制 | 来源洞察 |
|---|---|
| 购买前录入与已有物比对 | ReWear |
| 冷静期与承诺 | Philips |
| 体验目标与非物质满足 | Kat |
| 延长已有物使用、避免换新 | Areez |
| 预算敏感学生与公平/隐私意识 | Mateen |

融合的是行为机制，不是把五个原产品并排放进导航。

### 品牌决定

- Working/final hackathon name：**Lemonade**。此前记录的 `Lenmonade` 是输入拼写错误，已于 2026-07-11 更正。
- Tagline：**Spend on moments, not stuff.**
- **已知品牌风险：** Lemonade Inc. 是大型保险科技公司，其 App 位于 Finance 分类并拥有百万级下载。Hackathon 可按团队决定使用 Lemonade，但 GitHub、网站和视频必须用副标题 `Lemonade — Mindful Spending` 区分；赛后继续前应更名或完成正式商标审查。[Lemonade Insurance](https://www.lemonade.com/)

## 5. 已冻结约束

- 剩余开发时间约 24 小时。
- 正式提交截止：**2026-07-12 12:00 悉尼时间（AEST）**，即 **2026-07-12 10:00 上海时间（CST）**。
- Pitch/video：3 分钟。
- 交付：GitHub link、3 分钟 demonstration video、deployed website。
- 官方评分：Innovation & Creativity、Technical Complexity & Completeness、UX & Design、Practicality & Usability、Presentation & Pitch、Team Collaboration；权重未知。
- Xinxiang 是唯一核心开发者，熟悉 Next.js、React、WXT、Vercel 和 Groq。
- 不使用真实银行连接，不声称已有金融机构、学校、慈善组织或维修机构合作。
- Atlassian 是赞助商，但没有单独奖项或技术使用要求，因此不强行集成 Forge。
- MVP 目标用户正式锁定为 **18–30 岁学生和年轻成年人**。
- 团队目标游戏化程度正式设为 **7/10**：用户应感知到持续任务、成长、资源配置和世界反馈，但产品仍以真实消费决策为核心，不发展虚拟商城、战斗或复杂游戏经济。
- 核心玩法已从早期 **Budget Packing Puzzle** 提案调整为 **Lemonade Lane pocket-world management simulation**。业务层继续保留有限预算与机会成本约束；游戏层使用 `Reflection / Reuse commitment / Planned allocation` 解锁不同项目，再由有限居民行动决定本周期发生哪些活动。Packing Puzzle 不再作为并行核心游戏。
- 世界规模锁定为一个单屏口袋街区，而非城市：Home Nook、Picnic Green、Workshop Corner 与 Little Station。建筑只是生活场景容器，主要反馈是角色开始修理、分享、准备旅行和共同活动。
- 角色方向锁定为手绘 2D `Pocket Mice`。小鼠将人类忽略的瓶盖、碎布、旧茶杯等改造成生活空间，使 reuse/repair 成为世界观的一部分；最终资产采用完整角色插画、隐藏式有限分层与完整关键姿势，不使用可见 CSS 几何拼接。
- 虚拟装饰不再被绝对禁止，但 P0 仅允许固定里程碑三选一：无真钱、无可购买货币、无随机奖励、无稀缺倒计时、无属性优势。奖励来自完成诚实复盘，不按商品价格或 Skip 金额发放。

## 6. 当前范围决策

完整愿景保留在 PRD，但 MVP 只做：

`目标/预算 -> 录入购买冲动 -> 重复/必要性干预 -> 冷静期 -> 决策 -> 资金重定向 -> 游戏化目标进度`

以下不进入 P0：银行连接、真实二手 marketplace、真实体验预订、债务账户同步、浏览器扩展、全自动衣橱扫描、儿童版、多用户社交。

## 6.1 两份 PRD 冲突的最终裁决

- 冷静期是用户自愿承诺；Web MVP 不声称能够阻止外部付款。
- `Skip` 只记录未购买决定；用户再次确认 `planned allocation` 后，目标进度才增加。
- `Cooling List` 保存想买物；`My Stuff` 保存已有物，两者不再混称 Library。
- Demo 使用 Japan trip 等体验目标；数据模型同时支持 experience / savings / debt。
- AI 可以建议预算、分类和 coaching tone，最终值必须由用户确认。
- Buy anyway 不扣分、不让世界枯萎、不伤害角色、不清空 streak。
- 完成到期复盘可得少量 reflection XP；只有 planned allocation 推进现实目标。
- AI onboarding 属于 P1；weekly coach、push、open banking、social challenge 属于 future。
- 创新不再表述为首次使用冷静期/机会成本，而是 `owned-item substitution + concrete experience conversion + non-punitive game feedback`。

## 7. 研究依据

- 2026 年一项 363 人实验显示，AI 提供的认知或情感支持可以缓解购物 dark pattern 引发的冲动购买意愿。[研究](https://www.sciencedirect.com/science/article/abs/pii/S1071581925002526)
- 研究综述将 reflection、postponement 和 distraction 视为降低在线冲动购买的干预方式，但个性化与长期效果仍需验证。[研究](https://www.sciencedirect.com/science/article/pii/S2352250X24001465)
- 2026 年快时尚实验显示，行为抑制训练的效果可以超过纯信息教育，支持产品必须有行为机制而非只展示环保数据。[研究](https://www.sciencedirect.com/science/article/pii/S0272494426000150)
- 过往研究也发现先前“忍住消费”的显著记录可能成为下一次放纵的理由，因此游戏化不能只强化“我今天忍住了”的道德积分。[研究](https://www.sciencedirect.com/science/article/pii/S1057740809000151)

## 8. 待决事项

- 是否在 P1 加入一个真实 Groq 图片识别流程。
- 最终角色母版、三个地点状态图与效果资产尚待生成和验收。

P0 冷静期现固定为 24 小时；动态冷静期属于未来版本。新录入记录使用真实未来 review time，演示通过 seed 一条已经到期的 decision 完成闭环。

任何新决定都应追加到本文件，不再新建互相冲突的方向文档。

## 9. 新团队 PRD 输入记录

`docs/PRD Document.docx` 提出了 profile、dashboard、character library、real/virtual marketplace、bank simulation、necessity wishlist、statistics、lemon currency 和 arcade。

裁决：不作为并行开发规格；可复用 dashboard clarity、needs hierarchy 与 cozy visual tone。Marketplace、lemon currency、real prizes、arcade、credit score、auth/profile 和 bank simulation 不进入 P0。详细理由见 `07-team-prd-review.md`。

## 10. 2026-07-11 评分与对题复审

- 方案没有根本偏离题目：购买前干预、已有物 capability match、repair/reuse experiment 与 Cooling 均直接服务 mindful purchasing。
- 发现叙事偏移：若 demo 以 `Skip -> Japan allocation -> town grows` 为高潮，会被理解为游戏化储蓄软件。现将 `same-job owned item -> concrete repair/reuse experiment -> Ready reconsideration -> Workshop activity` 设为主要证明链；allocation/Station 降为可选次级结果。
- 发现交付偏移：完整 pnpm workspace、通用 WXT、Groq 与 30+ assets 是架构上限，不是同时必做的 P0。立即实现先在单一 Next app 内保持 domain/game-engine 边界；只有扩展真正开始时才抽共享 packages。
- Technical Complexity 必须由运行的 state machine、idempotent projector、resident scheduling、persistence 与 tests 证明；文档和空 package 不算 completeness。
- 详细逐项评分、修正 Demo 和 P0 见 `11-problem-and-scoring-audit.md`；交付 gates 已同步到 `02-delivery-plan.md`。

## 11. Browser Companion 最终转向

- P0 游戏表面从 Lemonade Lane town management 转为 **WXT 商品页 Pocket Mouse 浮窗 + Home Nook mission simulation**。这指浏览器页面内 Shadow Root companion，不是操作系统级 always-on-top 桌宠。
- 转向原因：让干预发生在真实 Add to Cart 场景，直接解决 standalone website 依赖用户主动打开的问题；同时删除城市/居民调度，降低美术与解释成本。
- 核心游戏约束改为两个 mission slots 与 Decision/Mission 双状态机；任务来自 `try existing / clean-restyle / repair / borrow-share / wait-reflect`，不来自 Skip 金额。
- My Stuff 升级为 same-job capability library；Demo 主高潮为已有物 repair/reuse mission 解决原始需求。Japan/planned allocation 仅为可选次级结果。
- Extension 在 high-confidence Product/Offer 页面自动 peeking；Add to Cart 显示可绕过提醒。低置信度不自动弹窗，始终提供 Continue/Snooze/Hide。
- 网站仍为必交且可独立运行；有扩展时通过受限 message/storage bridge 使用 extension state，无扩展时退回 localStorage demo。
- 当前唯一完整方向见 `12-browser-companion-pivot.md`。旧 town、Packing Puzzle 与 Two Futures 文档仅作为演进记录。

## 12. Browser Scout 与小镇并存修正

- 上一节错误地将用户提出的桌面宠物理解为“用 companion 取代小镇”。用户已明确：Lemonade Lane 仪表盘终端与小镇模拟经营保留，新增同一主角小鼠作为购物页面巡逻浮窗。
- 最终结构为 `shopping page Scout -> Pause -> Scout carries decision -> Browser Gate -> Lemonade Lane Dashboard -> Cooling/mission -> resident project activation`。
- Scout 负责跨页面巡逻、商品带回和决策连续性，不占用小镇的居民行动名额；Mender/Host 两名居民和 project eligibility/assignment 继续存在。
- 小镇是 Dashboard 本身，不放在普通金融 Dashboard 的装饰卡片中。桌面采用 Top Bar + 64px Nav Rail + dominant World Stage + 336px Command Deck + 112px Decision Dock；移动端使用上方 world + bottom sheet + bottom nav。
- `12-browser-companion-pivot.md` 保留检测、浮窗和 mission 细节，但其“替代小镇”结论作废。当前组合 UI/UX 以 `13-town-dashboard-uiux.md` 为准。
