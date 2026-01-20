import { useState, FormEvent } from 'react';
import { TaskFormData } from '../types/task';
import './TaskForm.css';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: TaskFormData;
  submitLabel?: string;
}

export const TaskForm = ({
  onSubmit,
  onCancel,
  initialData,
  submitLabel = '新增',
}: TaskFormProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() || undefined });
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="task-form__title"
        placeholder="任務標題"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        autoFocus
      />
      <textarea
        className="task-form__description"
        placeholder="任務描述（選填）"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />
      <div className="task-form__actions">
        <button type="submit" className="task-form__submit" disabled={submitting || !title.trim()}>
          {submitting ? '處理中...' : submitLabel}
        </button>
        <button type="button" className="task-form__cancel" onClick={onCancel}>
          取消
        </button>
      </div>
    </form>
  );
};
