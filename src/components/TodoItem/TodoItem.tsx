import { useState } from 'react';
import { TodoItem as TodoItemType } from '../../types';
import './TodoItem.scss';

type TodoItemProps = {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      onEdit(todo.id, trimmedText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const taskDate = new Date(date);
    
    const isSameDay = 
      today.getDate() === taskDate.getDate() &&
      today.getMonth() === taskDate.getMonth() &&
      today.getFullYear() === taskDate.getFullYear();
    
    return isSameDay
      ? 'Today'
      : taskDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="todo-edit">
          <input
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSave()}
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
              onChange={() => onToggle(todo.id)}
            />
            <span className="todo-text">{todo.text}</span>
            <span className="date">{formatDate(todo.createdAt)}</span>
          </div>
          <div className="actions">
            <button onClick={handleEdit} disabled={todo.completed}>Edit</button>
            <button 
              className="delete-button" 
              onClick={() => onDelete(todo.id)}
              aria-label="Delete task"
            >
              ✕
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem; 