import { useState, useEffect, useCallback, useMemo } from 'react';
import { TodoItem as TodoItemType, TodoFilter, TodoSort } from '../../types';
import TodoItemComponent from '../TodoItem/TodoItem';
import TodoForm from '../TodoForm/TodoForm';
import TodoFilters from '../TodoFilters/TodoFilters';
import './TodoList.scss';

// Storage keys - using a single prefix for consistency
const STORAGE_PREFIX = 'todo-app-';
const STORAGE_KEYS = {
  TODOS: `${STORAGE_PREFIX}todos`,
  FILTER: `${STORAGE_PREFIX}filter`,
  SORT: `${STORAGE_PREFIX}sort`
};

const TodoList = () => {
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sort, setSort] = useState<TodoSort>('date');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data on first render
  useEffect(() => {
    try {
      // Get values from localStorage or use defaults
      const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEYS.TODOS) || '[]');
      const savedFilter = localStorage.getItem(STORAGE_KEYS.FILTER) as TodoFilter || 'all';
      const savedSort = localStorage.getItem(STORAGE_KEYS.SORT) as TodoSort || 'date';
      
      // Convert dates back to Date objects
      if (savedTodos.length) {
        setTodos(savedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        })));
      }
      
      setFilter(savedFilter);
      setSort(savedSort);
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    
    setIsLoaded(true);
  }, []);

  // Save data when it changes
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      // Convert dates to strings for storage
      const todosToSave = todos.map(todo => ({
        ...todo,
        createdAt: todo.createdAt.toISOString()
      }));
      
      localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todosToSave));
      localStorage.setItem(STORAGE_KEYS.FILTER, filter);
      localStorage.setItem(STORAGE_KEYS.SORT, sort);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [todos, filter, sort, isLoaded]);

  // CRUD operations with useCallback
  const addTodo = useCallback((text: string) => {
    setTodos(prevTodos => [
      ...prevTodos, 
      {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date()
      }
    ]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  const editTodo = useCallback((id: string, text: string) => {
    setTodos(prevTodos => prevTodos.map(todo => 
      todo.id === id ? { ...todo, text } : todo
    ));
  }, []);

  // Filter change handler
  const handleFilterChange = useCallback((newFilter: TodoFilter) => {
    setFilter(newFilter);
  }, []);

  // Filter and sort todos with useMemo
  const filteredAndSortedTodos = useMemo(() => {
    return [...todos]
      .filter(todo => {
        if (filter === 'all') return true;
        return filter === 'completed' ? todo.completed : !todo.completed;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [todos, filter]);

  return (
    <div className="todo-list-container">
      <h1>Tasks</h1>
      
      <TodoForm onAddTodo={addTodo} />
      <TodoFilters filter={filter} onFilterChange={handleFilterChange} />
      
      <div className="todo-list">
        {filteredAndSortedTodos.length > 0 ? (
          filteredAndSortedTodos.map(todo => (
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
};

export default TodoList; 