import { useState } from 'react';
import { Task, TaskFormData } from '../types/task';
import { TaskForm } from './TaskForm';
import './TaskItem.css';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, data: TaskFormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  dragHandleProps?: any;
  isDragging?: boolean;
}

export const TaskItem = ({
  task,
  onUpdate,
  onDelete,
  dragHandleProps,
  isDragging = false,
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (data: TaskFormData) => {
    try {
      await onUpdate(task.id, data);
      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('確定要刪除此任務嗎？')) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch (err) {
      console.error('Delete error:', err);
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="task-item task-item--editing">
        <TaskForm
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          initialData={{ title: task.title, description: task.description }}
          submitLabel="儲存"
        />
      </div>
    );
  }

  return (
    <div className={`task-item ${isDragging ? 'task-item--dragging' : ''}`}>
      <div className="task-item__drag-handle" {...dragHandleProps}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="2" cy="2" r="1" fill="currentColor" />
          <circle cx="6" cy="2" r="1" fill="currentColor" />
          <circle cx="10" cy="2" r="1" fill="currentColor" />
          <circle cx="2" cy="6" r="1" fill="currentColor" />
          <circle cx="6" cy="6" r="1" fill="currentColor" />
          <circle cx="10" cy="6" r="1" fill="currentColor" />
          <circle cx="2" cy="10" r="1" fill="currentColor" />
          <circle cx="6" cy="10" r="1" fill="currentColor" />
          <circle cx="10" cy="10" r="1" fill="currentColor" />
        </svg>
      </div>
      <div className="task-item__content" onClick={() => setIsEditing(true)}>
        <h3 className="task-item__title">{task.title}</h3>
        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}
      </div>
      <button
        className="task-item__delete"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label="刪除任務"
      >
        {isDeleting ? '刪除中...' : '×'}
      </button>
    </div>
  );
};
