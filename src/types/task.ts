export type TaskCategory = 'work' | 'study' | 'life';

export type Task = {
  id: string;
  category: TaskCategory;
  title: string;
  description?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type TaskFormData = {
  title: string;
  description?: string;
};
