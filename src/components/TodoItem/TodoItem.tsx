import { useState, useCallback, memo } from 'react';
import { TodoItem as TodoItemType } from '../../types';
import './TodoItem.scss';

type TodoItemProps = {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

const TodoItem = memo(({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  // Обновляем editText при изменении todo.text (например, когда задача меняется извне)
  if (!isEditing && todo.text !== editText) {
    setEditText(todo.text);
  }

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditText(todo.text);
  }, [todo.text]);

  const handleSave = useCallback(() => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      onEdit(todo.id, trimmedText);
      setIsEditing(false);
    }
  }, [editText, onEdit, todo.id]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditText(todo.text);
  }, [todo.text]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [onToggle, todo.id]);

  const handleDelete = useCallback(() => {
    onDelete(todo.id);
  }, [onDelete, todo.id]);

  const formatDate = useCallback((date: Date) => {
    const today = new Date();
    const taskDate = new Date(date);
    
    const isSameDay = 
      today.getDate() === taskDate.getDate() &&
      today.getMonth() === taskDate.getMonth() &&
      today.getFullYear() === taskDate.getFullYear();
    
    return isSameDay
      ? 'Today'
      : taskDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }, []);

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
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
        <>
          <div className="todo-content">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggle}
            />
            <span className="todo-text">{todo.text}</span>
            <span className="date">{formatDate(todo.createdAt)}</span>
          </div>
          <div className="actions">
            <button onClick={handleEdit} disabled={todo.completed}>Edit</button>
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

TodoItem.displayName = 'TodoItem';

export default TodoItem; 