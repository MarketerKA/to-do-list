import { useState, useCallback, memo } from 'react';
import './TodoForm.scss';

type TodoFormProps = {
  onAddTodo: (text: string) => void;
}

/**
 * Компонент формы для добавления новых задач
 * Оптимизирован с помощью memo для предотвращения лишних перерисовок
 */
const TodoForm = memo(({ onAddTodo }: TodoFormProps) => {
  // Состояние для текстового поля
  const [text, setText] = useState('');

  // Обработчик отправки формы
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText) {
      onAddTodo(trimmedText);
      setText(''); // Очищаем поле после добавления
    }
  }, [text, onAddTodo]);

  // Обработчик изменения текстового поля
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  // Обработчик очистки текстового поля
  const clearText = useCallback(() => {
    setText('');
  }, []);

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        {/* Поле для ввода текста задачи */}
        <input
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={handleChange}
        />
        {/* Кнопка очистки поля (появляется только когда есть текст) */}
        {text && (
          <button 
            type="button" 
            className="clear-button"
            onClick={clearText}
            aria-label="Clear input"
          >
            ✕
          </button>
        )}
      </div>
      {/* Кнопка добавления задачи (неактивна, если поле пустое) */}
      <button type="submit" disabled={!text.trim()}>Add</button>
    </form>
  );
});

// Имя для отладки в React DevTools
TodoForm.displayName = 'TodoForm';

export default TodoForm; 