import { useState, useEffect, useCallback, useMemo } from 'react';
import { TodoItem, TodoFilter, TodoSort } from '../types';
import { STORAGE_KEYS } from '../constants/storage';

/**
 * Хук для управления списком задач
 */
export const useTodos = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [sort, setSort] = useState<TodoSort>('date');
  const [isLoaded, setIsLoaded] = useState(false);

  // Загрузка данных из localStorage
  useEffect(() => {
    try {
      const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEYS.TODOS) || '[]');
      const savedFilter = localStorage.getItem(STORAGE_KEYS.FILTER) as TodoFilter || 'all';
      const savedSort = localStorage.getItem(STORAGE_KEYS.SORT) as TodoSort || 'date';
      
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
    if (!isLoaded) return;
    
    try {
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

  // CRUD операции
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

  const changeFilter = useCallback((newFilter: TodoFilter) => {
    setFilter(newFilter);
  }, []);

  // Фильтрация и сортировка задач с useMemo
  const filteredTodos = useMemo(() => {
    return [...todos]
      .filter(todo => {
        if (filter === 'all') return true;
        return filter === 'completed' ? todo.completed : !todo.completed;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [todos, filter]);

  return {
    todos,
    filter,
    sort,
    filteredTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    changeFilter
  };
}; 