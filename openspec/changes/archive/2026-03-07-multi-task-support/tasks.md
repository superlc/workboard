## Tasks

### 1. 修改解析 API 支持多任务 ✅
- **文件**: `src/app/api/parse/route.ts`
- **Spec**: PARSE-1, PARSE-2
- **详情**:
  - 重写 systemPrompt，指示 AI 识别所有任务并返回 `{ "tasks": [...] }` 格式
  - 在 JSON 解析后增加归一化逻辑，兼容单对象/裸数组/标准格式
  - 确保无论 AI 返回什么格式，API 响应始终为 `{ tasks: ParsedTask[] }`

### 2. 新增批量创建数据层函数
- **文件**: `src/lib/tasks.ts`
- **Spec**: TASK-API-2
- **详情**:
  - 新增 `createTasks(tasks: Task[]): Task[]` 函数
  - 使用 `db.transaction` 包裹批量插入
  - 返回带自增 ID 的任务数组

### 3. 修改任务 API 支持批量创建 ✅
- **文件**: `src/app/api/tasks/route.ts`
- **Spec**: TASK-API-1
- **详情**:
  - POST handler 检测请求体是否包含 `tasks` 数组
  - 有 → 调用 `createTasks` 批量创建，返回 `{ tasks: Task[] }`
  - 没有 → 保持原有单任务逻辑（向后兼容）

### 4. 创建批量确认弹窗组件 ✅
- **文件**: `src/components/task-logger/TaskBatchConfirmModal.tsx`
- **Spec**: MODAL-1, MODAL-2, MODAL-3, MODAL-4
- **详情**:
  - 新建组件，接收 `parsedTasks: ParsedTask[]`
  - 渲染可编辑的任务卡片列表（内容、时间、标签均可修改）
  - 支持删除单条任务
  - 底部 "全部保存" 按钮触发 `onSave(tasks[])`
  - 复用 `toDatetimeLocal` 时间格式转换逻辑

### 5. 适配录入页面并清理旧组件 ✅
- **文件**: `src/app/tasks/page.tsx`
- **Spec**: LOG-1, LOG-2
- **详情**:
  - 状态从 `parsedTask` 改为 `parsedTasks: ParsedTask[]`
  - `handleTaskParsed` 从 `data.tasks` 取数组
  - 替换为 `TaskBatchConfirmModal`
  - `handleSaveTasks` 使用 `{ tasks: [...] }` 批量 POST
  - 删除旧的 `TaskConfirmationModal.tsx`（已被替代）
