import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Task, TaskCategory, TaskFormData } from '../types/task';

export const useTasks = (category: TaskCategory) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('category', category)
        .order('order_index', { ascending: true });

      if (fetchError) throw fetchError;
      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入任務失敗');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (formData: TaskFormData) => {
    try {
      setError(null);
      // 取得該分類的最大 order_index
      const { data: maxOrderData } = await supabase
        .from('tasks')
        .select('order_index')
        .eq('category', category)
        .order('order_index', { ascending: false })
        .limit(1)
        .single();

      const newOrderIndex = maxOrderData?.order_index != null ? maxOrderData.order_index + 1 : 0;

      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert({
          category,
          title: formData.title,
          description: formData.description || null,
          order_index: newOrderIndex,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      await fetchTasks();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '新增任務失敗';
      setError(errorMessage);
      throw err;
    }
  };

  const updateTask = async (id: string, formData: TaskFormData) => {
    try {
      setError(null);
      const { data, error: updateError } = await supabase
        .from('tasks')
        .update({
          title: formData.title,
          description: formData.description || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      await fetchTasks();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新任務失敗';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchTasks();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '刪除任務失敗';
      setError(errorMessage);
      throw err;
    }
  };

  const reorderTasks = async (newOrder: Task[]) => {
    try {
      setError(null);
      // 樂觀更新
      setTasks(newOrder);

      // 批次更新 order_index（使用 Promise.all 並行執行）
      const updatePromises = newOrder.map((task, index) =>
        supabase
          .from('tasks')
          .update({ order_index: index })
          .eq('id', task.id)
      );

      const results = await Promise.all(updatePromises);
      const hasError = results.some((result) => result.error);

      if (hasError) {
        const firstError = results.find((result) => result.error)?.error;
        // 如果失敗，重新載入資料
        await fetchTasks();
        throw firstError;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '排序失敗';
      setError(errorMessage);
      await fetchTasks(); // 重新載入以恢復正確順序
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    refreshTasks: fetchTasks,
  };
};
