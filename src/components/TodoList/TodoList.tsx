import { memo } from 'react';
import { useTodos } from '../../hooks/useTodos';
import TodoItemComponent from '../TodoItem/TodoItem';
import TodoForm from '../TodoForm/TodoForm';
import TodoFilters from '../TodoFilters/TodoFilters';
import './TodoList.scss';

/**
 * Главный компонент для управления задачами
 */
const TodoList = memo(() => {
  const {
    filter,
    filteredTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    changeFilter
  } = useTodos();

  return (
    <div className="todo-list-container">
      <h1>Tasks</h1>
      
      <TodoForm onAddTodo={addTodo} />
      <TodoFilters filter={filter} onFilterChange={changeFilter} />
      
      <div className="todo-list">
        {filteredTodos.length > 0 ? (
          filteredTodos.map(todo => (
            <TodoItemComponent
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))
        ) : (
          <p className="empty-message">No tasks found</p>
        )}
      </div>
    </div>
  );
});

TodoList.displayName = 'TodoList';

export default TodoList; 