import { memo } from 'react';
import { useTodoForm } from '../../hooks/useTodoForm';
import './TodoForm.scss';

type TodoFormProps = {
  onAddTodo: (text: string) => void;
}

/**
 * Компонент формы для добавления новых задач
 */
const TodoForm = memo(({ onAddTodo }: TodoFormProps) => {
  const { text, isValid, handleSubmit, handleChange, clearText } = useTodoForm({ onAddTodo });

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
      <button type="submit" disabled={!isValid}>Add</button>
    </form>
  );
});

// Имя для отладки в React DevTools
TodoForm.displayName = 'TodoForm';

export default TodoForm; 