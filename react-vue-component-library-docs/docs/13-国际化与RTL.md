# 13｜国际化、日期与 RTL

## 1. Locale 数据

首期提供 zh-CN、zh-TW、en-US 可独立导入的资源，默认 zh-CN。格式 `{ code, messages, firstDayOfWeek, dateFormats }`；通过 ConfigProvider 传 locale。库只翻译自己生成的“关闭、清空、加载、暂无数据、上一页”等文字，不翻译使用者的 children、options.label 或业务错误。

缺失键按 zh-CN 回退并在开发环境提示；生产不能渲染 undefined。复杂计数采用可扩展 formatter 接口，不简单把数字拼在英文句尾。长英文、繁体中文、emoji 和混合语言都有布局测试。

## 2. 日期与时区

DatePicker 的 value 使用日期字符串 `YYYY-MM-DD`，TimePicker 使用 `HH:mm[:ss]`。它们不是带时区时间点。业务需要绝对时间时单独使用 ISO 时间戳与显式 timezone 转换，不能悄悄混用。

v1 默认公历。周起始由 locale/prop 控制；闰年、跨月、区间、min/max、disabledDate 单独校验。不要承诺农历、节假日权威数据或所有历法；这些需要独立数据源和适配方案。

格式化优先使用 Intl，但必须在实际 Node/浏览器矩阵验证 locale 数据和序列化结果。可插拔日期适配器是后续能力；不强制所有用户安装重型日期库。

## 3. RTL

Provider 支持 `dir='ltr'|'rtl'`，生成正确 dir 属性。样式使用 margin-inline、padding-inline、inset-inline、border-start-start 等逻辑属性。使用 placement=start/end 替代把 left/right 混成阅读方向。

箭头方向和前进/后退等有方向含义的图标允许镜像；播放、确认、品牌、文字、数字等不自动镜像。水平组件键盘方向按其选定无障碍模式与视觉顺序测试，不能对所有方向键简单反转。

## 4. 动态切换

locale 和 dir 改变后，已打开弹层、错误文案、通知默认文案和日期标题必须更新。用户输入和选中 key 不随翻译变化。通知里用户自定义的文本不被库改写。

## 5. 验收

一页同时有 LTR 与 RTL 的嵌套 Provider；长文字、上下标、阿拉伯数字、中文输入法；locale 切换时仍保持焦点与值；日期首周、12/24 小时显示；SSR 与客户端相同 locale。RTL 支持不等于已提供完整阿拉伯语翻译。
