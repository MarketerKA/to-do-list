import { useState } from 'react';
import './TodoForm.scss';

type TodoFormProps = {
  onAddTodo: (text: string) => void;
}

const TodoForm = ({ onAddTodo }: TodoFormProps) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText) {
      onAddTodo(trimmedText);
      setText('');
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        {text && (
          <button 
            type="button" 
            className="clear-button"
            onClick={() => setText('')}
            aria-label="Clear input"
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" disabled={!text.trim()}>Add</button>
    </form>
  );
};

export default TodoForm; 