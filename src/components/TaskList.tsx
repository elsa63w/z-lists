import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, TaskFormData } from '../types/task';
import { TaskItem } from './TaskItem';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: string, data: TaskFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

interface SortableTaskItemProps {
  task: Task;
  onUpdate: (id: string, data: TaskFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const SortableTaskItem = ({ task, onUpdate, onDelete }: SortableTaskItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskItem
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
};

export const TaskList = ({ tasks, onUpdate, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="task-list task-list--empty">
        <p className="task-list__empty-message">尚無任務</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <SortableTaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
