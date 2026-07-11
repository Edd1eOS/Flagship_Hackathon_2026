# Lemonade 视觉方向：从 Pitch 风格图到产品 UI

> **更新说明：** 本文的色彩、字体和 sticker art 原则继续有效；关于 Packing Puzzle/Life Draft 的玩法比较已被 Lemonade Lane 决定覆盖。世界与角色美术以 `09-pocket-world-art-direction.md` 为准，场景状态以 `10-business-and-game-logic.md` 为准。

> 参考文件：`docs/style.png`  
> 状态：产品气质已确认；核心玩法现为 Lemonade Lane pocket-world management simulation。

## 1. 参考图的真实特征

### 视觉语言

- 手绘、圆润、略不规则的 display lettering。
- 深色粗描边的扁平插画，像 sticker 或桌游 token。
- 柠檬黄与草绿作为高识别色。
- 大量白色留白，奶油色有机形状只占局部。
- 图文分区明确，每页只表达一个重点。
- 可亲、乐观、略带校园创意感，但不是传统银行科技风。

### 不应误读

- 截图中第一页外侧紫色双框是 PPT 编辑器的选中状态，不纳入品牌视觉。
- 参考图的棕色正文与大面积奶油色适合 slide，但直接搬到 App 会降低数据清晰度。
- 参考图中的图标是插画，不代表所有按钮都应使用手绘图标。

## 2. 产品气质定义

> **A playful illustrated decision board, not a childish finance game.**

中文：一个有插画感的消费决策桌游界面，而不是儿童理财游戏，也不是严肃银行 dashboard。

关键词：

- optimistic
- tactile
- hand-drawn
- clear
- warm
- game-board
- non-judgmental

避免：

- corporate fintech navy
- 全屏米色 lifestyle App
- 霓虹电竞/RPG
- 绿色环保模板
- 过多 emoji
- 卡片套卡片

## 3. 对游戏类型的影响

### 最匹配：Budget Packing Puzzle

每个金额块可以成为一张粗描边 sticker：

- 黄：experience/goal block
- 绿：savings/debt contribution
- 珊瑚：cooling want
- 蓝：social/learning experience

用户把 sticker 放入有限 budget board，视觉上天然像桌游拼块。块被放置时产生轻微 snap/squash，机会成本通过空间碰撞而非报表表达。

### 次匹配：Life Draft

每个选择做成图文清楚的插画卡牌。它和 Pitch 风格非常一致，开发也较快；但需要避免商品卡牌成为收藏品。

### 不太匹配

- 极简 Campaign Map：过于像普通进度产品，浪费 sticker 语言。
- 复杂 Living World：需要大量场景资产，参考风格会显著放大制作成本。
- 3D/写实游戏：与手绘 slide 完全不一致。

## 4. 建议 Design Tokens

以下是方向值，最终开发时需做对比度检查：

```css
:root {
  --canvas: #FCFBF7;
  --surface: #FFFFFF;
  --ink: #2D2A26;
  --muted: #6F6A62;
  --line: #D9D5CE;
  --cream-accent: #F4E8D5;
  --lemon: #F4D548;
  --leaf: #76B84A;
  --coral: #ED806B;
  --sky: #6EB7D6;
}
```

规则：

- 主背景使用 white/warm white，cream 不超过首屏视觉面积约 20%。
- Lemon yellow 不用于长段文字。
- 所有金额与正文必须达到可访问对比度。
- 不使用渐变作为主视觉。
- 不把品牌限制成黄/绿双色；珊瑚和蓝用于信息层级。

## 5. Typography

### Display

选择有手绘感但仍可读的字体，用于：

- `Lemonade` wordmark
- H1/H2
- milestone title
- `Choice ready` 等短反馈

候选方向：Balsamiq Sans、Fredoka 或相近的开源字体。最终只选一个，不混用多种手写体。

### Body/Data

使用清晰 sans-serif，例如 Inter、Nunito Sans 或 Geist：

- 金额
- countdown
- 表单
- 正文
- tooltip

数字建议使用 tabular numerals，避免 timer 和金额变化时宽度跳动。

### 排版规则

- Letter spacing 固定为 0，不使用负字距。
- 手写字体不用于超过两行的正文。
- Dashboard 内标题保持紧凑，不使用 hero 级字号。

## 6. Component Language

### 标准 UI

- Button、Dialog、Drawer、Tooltip、Tabs 使用 shadcn/Radix。
- Button 内使用 Lucide icon。
- 普通 container 6–8px radius、1px neutral border。
- 不用 pill 形状承载长文本。

### Game UI

- Budget board 有固定 aspect ratio 和稳定 grid。
- Game pieces 使用 2–3px ink outline、轻微 paper texture、明确金额标签。
- Piece 尺寸由成本单位决定，标签不会改变格子尺寸。
- 当前选中 piece 使用 shadow/offset，不用紫色 outline。
- Cooling tray、monthly board 和 goal area 是三个无嵌套的明确区域。

### Illustration vs Icon

- Illustration：商品/体验概念、milestone、board pieces。
- Icon：添加、关闭、返回、设置、计时、删除、信息。
- 不使用手绘插画代替关闭/返回等熟悉操作。

## 7. Motion Language

| 事件 | 动画 |
|---|---|
| Piece selected | 轻微抬升 + shadow，150ms |
| Piece placed | snap + 0.96→1 scale，220ms |
| Invalid placement | 短 horizontal nudge，不闪红整屏 |
| Review complete | XP 数字短滚动，300ms |
| Planned allocation | 目标 piece 填充/锁定，350ms |
| Milestone | 2–3 个 hand-drawn sparkle，400ms 内结束 |
| Buy anyway | 中性收纳动画，无枯萎/破裂 |

遵守 `prefers-reduced-motion`，动画不能改变布局尺寸。

## 8. Asset Plan

### 真实素材

- 目标商品：真实鞋/衣物图。
- My Stuff：队员真实已有物照片。
- 体验目标：可使用真实目的地/活动照片，但避免 stock-like hero。

### 生成素材

视觉玩法冻结后，用 imagegen 生成一套透明背景 sticker sheet：

- hostel bed
- rail pass/train
- concert ticket
- savings shield
- debt checkpoint
- lemon compass/marker

统一要求：粗深色描边、扁平柠檬黄/绿/珊瑚/蓝、轻纸张纹理、无文字、透明背景。

不要逐张分别生成，否则线条和配色会漂移；一次生成同一 sheet，再切分使用。

## 9. Pitch 与 App 对齐

- PPT 和 App 共用 palette、display font、outline width 和插画资产。
- Slide 使用更大标题和更多留白；App 不照搬 slide 的巨大字体。
- Video 中先出现 Pitch 的 lemon glass，再进入 App 的同一品牌色与 sticker board，形成连续感。
- 架构图和研究页仍使用清晰 sans-serif，不强行手写所有文字。

## 10. 当前建议

该风格使 **Budget Packing Puzzle** 的可行性进一步高于 Campaign Map：它能把 UI 直接变成一张可操作的 illustrated decision board，游戏感来自 sticker 的空间配置，而不是额外套一层卡通皮肤。

若团队选择 Life Draft，同一视觉系统也能复用；因此现在可以先冻结颜色、字体层级、outline 和 motion，不必等核心玩法最终选择后才开始所有视觉工作。
