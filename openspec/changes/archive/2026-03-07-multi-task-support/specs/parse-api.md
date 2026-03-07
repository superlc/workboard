## 解析 API 多任务支持

### PARSE-1: Prompt 改为多任务格式

修改 `src/app/api/parse/route.ts` 中的 `systemPrompt`：
- 指示 AI 识别输入中的**所有任务**
- 返回格式固定为 `{ "tasks": [...] }`
- 单条任务也返回长度为1的数组
- 保留现有的时间格式规则（本地时间，无Z后缀）

### PARSE-2: 响应归一化

在 JSON 解析后增加归一化逻辑：
- `{ tasks: [...] }` → 直接使用
- `{ content, ... }` 单对象 → 包装为 `{ tasks: [obj] }`
- `[...]` 裸数组 → 包装为 `{ tasks: arr }`
- 确保返回给前端的格式始终为 `{ tasks: ParsedTask[] }`
