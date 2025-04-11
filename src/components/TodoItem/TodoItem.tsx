import { useState, useCallback, memo } from 'react';
import { TodoItem as TodoItemType } from '../../types';
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
  // Состояние для режима редактирования и текста в поле ввода
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  // Обновляем editText при изменении todo.text (например, когда задача меняется извне)
  if (!isEditing && todo.text !== editText) {
    setEditText(todo.text);
  }

  // Переход в режим редактирования
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditText(todo.text);
  }, [todo.text]);

  // Сохранение изменений в задаче
  const handleSave = useCallback(() => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      onEdit(todo.id, trimmedText);
      setIsEditing(false);
    }
  }, [editText, onEdit, todo.id]);

  // Отмена редактирования
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditText(todo.text);
  }, [todo.text]);

  // Обработка изменений в поле ввода
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  }, []);

  // Обработка нажатий клавиш (Enter для сохранения, Escape для отмены)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  // Переключение статуса выполнения задачи
  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [onToggle, todo.id]);

  // Удаление задачи
  const handleDelete = useCallback(() => {
    onDelete(todo.id);
  }, [onDelete, todo.id]);

  // Форматирование даты создания задачи
  const formatDate = useCallback((date: Date) => {
    const today = new Date();
    const taskDate = new Date(date);
    
    // Проверяем, создана ли задача сегодня
    const isSameDay = 
      today.getDate() === taskDate.getDate() &&
      today.getMonth() === taskDate.getMonth() &&
      today.getFullYear() === taskDate.getFullYear();
    
    // Если задача создана сегодня, показываем "Today", иначе - дату
    return isSameDay
      ? 'Today'
      : taskDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }, []);

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
            <button onClick={handleSave} disabled={!editText.trim()}>Save</button>
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
            <span className="date">{formatDate(todo.createdAt)}</span>
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