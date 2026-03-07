## 技术设计

### 1. API 解析层 (`/api/parse`)

**Prompt 改造**

将 AI 返回格式从单对象改为数组包装：

```
返回格式始终为：
{
  "tasks": [
    { "content": "...", "start_time": "...", "end_time": "...", "tags": [...] },
    ...
  ]
}
```

**响应归一化**

解析 AI 返回后做兼容处理：
- 如果返回的是 `{ tasks: [...] }` → 直接使用
- 如果返回的是单个对象 `{ content, ... }` → 包装为 `{ tasks: [obj] }`
- 如果返回的是裸数组 `[...]` → 包装为 `{ tasks: arr }`

这样无论 AI 输出什么格式，前端始终拿到 `{ tasks: ParsedTask[] }`。

### 2. 批量保存接口 (`/api/tasks` POST)

**请求体格式变更**

支持两种格式（向后兼容）：
- 单任务（旧）：`{ content, start_time, end_time, tags }` → 创建1条
- 多任务（新）：`{ tasks: [{ content, ... }, ...] }` → 批量创建

**实现**：使用 SQLite 事务 (`db.transaction`) 批量插入，保证原子性。

### 3. 数据层 (`src/lib/tasks.ts`)

新增 `createTasks(tasks: Task[]): Task[]` 函数：
- 使用 `db.transaction` 包裹
- 循环调用 insert prepared statement
- 返回所有创建的任务（含自增ID）

### 4. 批量确认弹窗 (`TaskBatchConfirmModal`)

**交互设计**：
- Dialog 标题显示 "确认任务（共 N 条）"
- 任务列表每条显示为可折叠/展开的卡片
- 每张卡片包含：任务内容、开始时间、结束时间、标签（均可编辑）
- 每张卡片右上角有删除按钮（允许移除不想保存的任务）
- 底部操作栏："取消" + "全部保存（N 条）"
- 如果全部删除则自动关闭弹窗

**Props 接口**：
```typescript
interface TaskBatchConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  parsedTasks: ParsedTask[];
  onSave: (tasks: ParsedTask[]) => void;
}
```

### 5. 页面适配 (`LogPage`)

数据流变更：
```
TaskInput.onParsed(data: { tasks: ParsedTask[] })
  → setParsedTasks(data.tasks)
  → 打开 TaskBatchConfirmModal
  → 用户确认/编辑
  → onSave(tasks[])
  → POST /api/tasks { tasks: [...] }
  → 刷新列表
```

### 6. 兼容性

- 旧的 `TaskConfirmationModal` 将被 `TaskBatchConfirmModal` 替代
- `/api/tasks` POST 同时支持单条和批量，不破坏已有调用
- `/api/parse` 返回统一为 `{ tasks: [...] }` 格式
