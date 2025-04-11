import { useState, useCallback, useEffect } from 'react';
import { TodoItem } from '../types';

type UseTodoItemProps = {
  todo: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

/**
 * Хук для управления отдельной задачей
 */
export const useTodoItem = ({ todo, onToggle, onDelete, onEdit }: UseTodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  // Обновляем editText при изменении todo.text
  useEffect(() => {
    if (!isEditing) {
      setEditText(todo.text);
    }
  }, [todo.text, isEditing]);

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

  return {
    isEditing,
    editText,
    isTextValid: editText.trim().length > 0,
    formattedDate: formatDate(todo.createdAt),
    handleEdit,
    handleSave,
    handleCancel,
    handleChange,
    handleKeyDown,
    handleToggle,
    handleDelete
  };
}; 