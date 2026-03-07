## 批量确认弹窗

### MODAL-1: 组件结构

新建 `src/components/task-logger/TaskBatchConfirmModal.tsx`：
- Props: `isOpen`, `onClose`, `parsedTasks: ParsedTask[]`, `onSave: (tasks: ParsedTask[]) => void`
- 内部用 `formTasks` state 管理可编辑的任务列表

### MODAL-2: 任务列表展示

- Dialog 宽度加大（`sm:max-w-[600px]`）适配列表布局
- 标题显示 "确认任务（共 N 条）"
- 每条任务渲染为一张卡片，包含：
  - 任务内容（可编辑 Input）
  - 开始时间 / 结束时间（datetime-local）
  - 标签（逗号分隔 Input）
  - 右上角删除按钮（X 图标）

### MODAL-3: 操作逻辑

- 删除某条任务：从 `formTasks` 中移除，如果全部删除则自动关闭
- 全部保存：调用 `onSave(formTasks)`
- 取消：关闭弹窗，不保存
- 时间格式转换复用现有的 `toDatetimeLocal` 逻辑

### MODAL-4: 替代旧组件

- 新组件完全替代 `TaskConfirmationModal`
- 单任务场景（数组长度1）也正常工作，体验不退化
