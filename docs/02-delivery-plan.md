# 24 小时交付计划

> 目标：GitHub、部署网站、3 分钟 demo video 均提前完成。  
> 正式截止：2026-07-12 12:00 悉尼时间（AEST）/ 10:00 上海时间（CST）。  
> 计划仍以相对小时执行；所有提交必须在截止前至少 60 分钟完成。

## 1. Feature Gates

> 2026-07-11 14:22 CST 审计时约余 19 小时 38 分钟；以下 H0 从该审计完成后重新计时。

- **H1 Runnable Shell：** 单一 Next app、seed、repository adapter、Reset Demo、静态 Home Nook 可运行。
- **H4 Behaviour Loop：** Ready sneakers -> same-job My Stuff match -> repair/reuse mission -> Buy/Use existing/Repair/Extend 全部可运行。
- **H7 Interception Loop：** WXT 在 controlled storefront 识别商品，浮动小鼠显示 Pause/Continue，并把商品交给同一 Capture/mission 流程。
- **H10 Mission Simulation：** Companion + Mission 双状态机、两个 mission slots、真实 Cooling、seeded Ready、Home repair activity 可运行。
- **H12 First Deploy：** Vercel 匿名链接、无扩展 localStorage fallback、desktop/mobile、Reset 可用；开始 Playwright 与 README。
- **H14 Visual Integration：** peeking/comparing/cooling/repair 核心姿势、Home base 与关键 Motion sequence 完成。
- **H15 Feature Freeze：** 停止新增功能；AI 默认删除，只做 bug、响应式、素材和文案。
- **H16 Video Record：** 先录无旁白保险版本，再录正式操作。
- **H18 Code Freeze：** README、引用、GitHub、部署和视频链接检查；只修提交阻断。
- **Deadline - 60m：** 所有交付完成，不在最后一小时首次上传。

## 2. Role Deliverables

| 成员 | 责任 | H2 | H8 | H16 | 最终 |
|---|---|---|---|---|---|
| Xinxiang | Product & Engineering | 技术骨架、schema | happy path | 部署候选、fallback | GitHub + website |
| Philip | Research & Product Evidence | 3 条权威证据 | 竞品/数据表 | README evidence | 引用核对 |
| Areez | Visual & Video | moodboard、页面重点 | deck/video storyboard | 最终画面与字幕 | 3m video export |
| Katherine | Narrative | 3m story skeleton | narration v1 | 计时稿、Q&A | 配音/讲解 |
| Mateen | Delivery Operations | 截止时区、看板、清单 | 素材/状态跟踪 | 两次彩排与链接表 | 提交确认 |

每个人都必须产生一个进入最终交付的文件或素材，避免 Team Collaboration 只剩角色名称。

## 3. Engineering Order

1. 单一 Next app、design tokens、seed、repository adapter、Reset Demo。
2. Decision state machine、Cooling/Ready、Mission state machine 与 command transaction。
3. My Stuff same-job capability match 与 explainable reasons。
4. 至少实现 `TRY_EXISTING` 或 `REPAIR` mission，以及 Ready check-in。
5. Buy/Use existing/Repair/Extend、Reflection 与 optional planned allocation。
6. WXT controlled storefront detection、Shadow Root floating mouse、Pause/Continue。
7. Extension storage/message bridge；网站无扩展时 localStorage fallback。
8. Home Nook、cooler/workbench activity、responsive、reduced motion。
9. Vitest、Playwright、首次部署、README。
10. Groq 默认不做；只有所有核心路径稳定才增加第二 mission/额外 cosmetic。

## 4. Research Deliverable

Philip 只需要交付一个表格：

| Claim | Exact source | Year/sample/region | Safe pitch wording | Slide |
|---|---|---|---|---|

只找三类：

- 冲动购买与数字 dark patterns；
- reflection/postponement 等行为干预；
- 体验、储蓄或目标进展对产品逻辑的支持。

禁止无来源的宏观数字和“我们的产品能减少 X% 消费”推断。

## 5. Video Production

- H8 完成 storyboard，镜头必须对应真实页面。
- H16 录一版无配音 screen capture，作为保险。
- H18 录正式操作和旁白。
- H20 前导出并从另一台设备完整播放。
- 画面优先 1080p、16:9；鼠标移动与输入提前排练。
- API 环节若延迟不可控，视频使用成功实录，不在剪辑中伪装未实现功能。

## 6. Submission Checklist

- [ ] GitHub repository 可公开访问或按规则授权。
- [ ] README 包含问题、方案、架构、运行方式、模拟数据说明和团队分工。
- [ ] `.env.example` 存在，真实 key 未提交。
- [ ] 网站匿名窗口可打开并完成主路径。
- [ ] 移动端无横向溢出。
- [ ] Reset Demo 可用。
- [ ] 3 分钟视频不超时，链接权限正确。
- [ ] 所有引用和影响数字可追溯。
- [ ] seed/模拟数据在 README 和 pitch 中被明确说明。
- [ ] 最终三个链接保存在同一提交清单。

## 7. Cut Order

时间不足时按此顺序删除：

1. Groq 图片识别。
2. Controlled storefront / high-confidence JSON-LD 之外的 retailer 支持。
3. First-use onboarding，录屏使用明确标记的 seed persona。
4. 第二、第三 mission 类型。
5. 三选一 cosmetic reward与 planned allocation postcard。
6. My Stuff 自由新增/删除，保留 contextual add 与 seed。
7. 非核心动画、配角和额外 Home overlays。

不得删除：controlled-page WXT 浮窗、Pause/Continue、same-job My Stuff match、一个真实 repair/reuse mission、24h Cooling + seeded Ready、诚实 Buy/Use existing/Repair/Extend、Home repair activity、网站 fallback 与 Reset Demo。它们共同证明产品在购物发生前让已有物重新参与决策。
