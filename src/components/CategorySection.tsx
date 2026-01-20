import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TaskCategory, TaskFormData } from '../types/task';
import { useTasks } from '../hooks/useTasks';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';
import './CategorySection.css';

interface CategorySectionProps {
  category: TaskCategory;
  title: string;
  icon: string;
}

export const CategorySection = ({ category, title, icon }: CategorySectionProps) => {
  const { tasks, loading, error, addTask, updateTask, deleteTask, reorderTasks } =
    useTasks(category);
  const [showForm, setShowForm] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      const newOrder = arrayMove(tasks, oldIndex, newIndex);
      try {
        await reorderTasks(newOrder);
      } catch (err) {
        console.error('Reorder error:', err);
      }
    }
  };

  const handleAddTask = async (data: TaskFormData) => {
    try {
      await addTask(data);
      setShowForm(false);
    } catch (err) {
      console.error('Add task error:', err);
    }
  };

  const handleUpdateTask = async (id: string, data: TaskFormData) => {
    await updateTask(id, data);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  return (
    <div className="category-section">
      <div className="category-section__header">
        <div className="category-section__title-wrapper">
          <span className="category-section__icon">{icon}</span>
          <h2 className="category-section__title">{title}</h2>
          <span className="category-section__count">({tasks.length})</span>
        </div>
      </div>

      <div className="category-section__content">
        {error && (
          <div className="category-section__error">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="category-section__loading">
            <p>載入中...</p>
          </div>
        ) : (
          <>
            {showForm ? (
              <div className="category-section__form">
                <TaskForm
                  onSubmit={handleAddTask}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            ) : (
              <button
                className="category-section__add-button"
                onClick={() => setShowForm(true)}
              >
                + 新增任務
              </button>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={tasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <TaskList
                  tasks={tasks}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              </SortableContext>
            </DndContext>
          </>
        )}
      </div>
    </div>
  );
};
