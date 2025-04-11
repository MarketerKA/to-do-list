import { useState, useCallback } from 'react';

type UseTodoFormProps = {
  onAddTodo: (text: string) => void;
};

/**
 * Хук для управления формой ввода новой задачи
 */
export const useTodoForm = ({ onAddTodo }: UseTodoFormProps) => {
  const [text, setText] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText) {
      onAddTodo(trimmedText);
      setText('');
    }
  }, [text, onAddTodo]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  const clearText = useCallback(() => {
    setText('');
  }, []);

  return {
    text,
    isValid: text.trim().length > 0,
    handleSubmit,
    handleChange,
    clearText
  };
}; 