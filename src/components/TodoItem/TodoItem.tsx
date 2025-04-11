import { memo } from 'react';
import { TodoItem as TodoItemType } from '../../types';
import { useTodoItem } from '../../hooks/useTodoItem';
import './TodoItem.scss';

type TodoItemProps = {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

/**
 * Компонент отдельной задачи
 * Отображает одну задачу с возможностью отметить как выполненную, редактировать или удалить
 * Оптимизирован с помощью memo для предотвращения ненужных перерисовок
 */
const TodoItem = memo(({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const {
    isEditing,
    editText,
    isTextValid,
    formattedDate,
    handleEdit,
    handleSave,
    handleCancel,
    handleChange,
    handleKeyDown,
    handleToggle,
    handleDelete
  } = useTodoItem({ todo, onToggle, onDelete, onEdit });

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        // Режим редактирования задачи
        <div className="todo-edit">
          <input
            type="text"
            value={editText}
            onChange={handleChange}
            autoFocus
            onKeyDown={handleKeyDown}
          />
          <div className="actions">
            <button onClick={handleSave} disabled={!isTextValid}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        // Режим просмотра задачи
        <>
          <div className="todo-content">
            {/* Чекбокс для отметки выполнения */}
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggle}
            />
            {/* Текст задачи */}
            <span className="todo-text">{todo.text}</span>
            {/* Дата создания */}
            <span className="date">{formattedDate}</span>
          </div>
          <div className="actions">
            {/* Кнопка редактирования (неактивна для выполненных задач) */}
            <button onClick={handleEdit} disabled={todo.completed}>Edit</button>
            {/* Кнопка удаления */}
            <button 
              className="delete-button" 
              onClick={handleDelete}
              aria-label="Delete task"
            >
              ✕
            </button>
          </div>
        </>
      )}
    </div>
  );
});

// Имя для отладки в React DevTools
TodoItem.displayName = 'TodoItem';

export default TodoItem; 