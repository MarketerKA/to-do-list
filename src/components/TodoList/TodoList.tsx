import { useState, useEffect, useCallback, useMemo } from 'react';
import { TodoItem as TodoItemType, TodoFilter, TodoSort } from '../../types';
import TodoItemComponent from '../TodoItem/TodoItem';
import TodoForm from '../TodoForm/TodoForm';
import TodoFilters from '../TodoFilters/TodoFilters';
import './TodoList.scss';

// Ключи для хранения данных в localStorage
const STORAGE_PREFIX = 'todo-app-';
const STORAGE_KEYS = {
  TODOS: `${STORAGE_PREFIX}todos`,
  FILTER: `${STORAGE_PREFIX}filter`,
  SORT: `${STORAGE_PREFIX}sort`
};

/**
 * Главный компонент для управления задачами
 * Содержит логику создания, редактирования и фильтрации задач
 */
const TodoList = () => {
  // Состояние приложения
  const [todos, setTodos] = useState<TodoItemType[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sort, setSort] = useState<TodoSort>('date');
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка данных из localStorage при первом рендере
  useEffect(() => {
    try {
      // Получаем сохраненные значения или используем значения по умолчанию
      const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEYS.TODOS) || '[]');
      const savedFilter = localStorage.getItem(STORAGE_KEYS.FILTER) as TodoFilter || 'all';
      const savedSort = localStorage.getItem(STORAGE_KEYS.SORT) as TodoSort || 'date';
      
      // Конвертируем строки дат обратно в объекты Date
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

  // Сохранение данных при их изменении
  useEffect(() => {
    if (!isLoaded) return; // Пропускаем первый рендер
    
    try {
      // Конвертируем объекты Date в строки для хранения
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

  // CRUD операции с использованием useCallback для оптимизации

  // Добавление новой задачи
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

  // Переключение статуса выполнения задачи
  const toggleTodo = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  // Удаление задачи
  const deleteTodo = useCallback((id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  // Редактирование текста задачи
  const editTodo = useCallback((id: string, text: string) => {
    setTodos(prevTodos => prevTodos.map(todo => 
      todo.id === id ? { ...todo, text } : todo
    ));
  }, []);

  // Обработчик изменения фильтра
  const handleFilterChange = useCallback((newFilter: TodoFilter) => {
    setFilter(newFilter);
  }, []);

  // Фильтрация и сортировка задач с использованием useMemo для кэширования результатов
  const filteredAndSortedTodos = useMemo(() => {
    // Фильтрация по статусу (все, активные, выполненные)
    return [...todos]
      .filter(todo => {
        if (filter === 'all') return true;
        return filter === 'completed' ? todo.completed : !todo.completed;
      })
      // Сортировка по дате создания (от новых к старым)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [todos, filter]); // Пересчитываем только при изменении задач или фильтра

  return (
    <div className="todo-list-container">
      <h1>Tasks</h1>
      
      {/* Форма для добавления новых задач */}
      <TodoForm onAddTodo={addTodo} />
      
      {/* Фильтры для переключения между статусами задач */}
      <TodoFilters filter={filter} onFilterChange={handleFilterChange} />
      
      {/* Список задач */}
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