import { useState, useCallback, memo } from 'react';
import './TodoForm.scss';

type TodoFormProps = {
  onAddTodo: (text: string) => void;
}

const TodoForm = memo(({ onAddTodo }: TodoFormProps) => {
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

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={handleChange}
        />
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
      <button type="submit" disabled={!text.trim()}>Add</button>
    </form>
  );
});

TodoForm.displayName = 'TodoForm';

export default TodoForm; 