import { memo, useCallback, useMemo } from 'react';
import { TodoFilter } from '../../types';
import './TodoFilters.scss';

type TodoFiltersProps = {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

// Возможные значения фильтров
const FILTERS: TodoFilter[] = ['all', 'active', 'completed'];

/**
 * Компонент фильтрации задач
 * Отображает кнопки для фильтрации задач по статусу выполнения
 */
const TodoFilters = memo(({ filter, onFilterChange }: TodoFiltersProps) => {
  // Функция для преобразования первой буквы в заглавную
  const capitalizeFirstLetter = useCallback((string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }, []);

  // Создаем набор обработчиков для кнопок фильтрации
  // Мемоизируем для предотвращения ненужных перерасчетов
  const filterHandlers = useMemo(() => {
    return FILTERS.map(filterOption => ({
      filter: filterOption,
      label: capitalizeFirstLetter(filterOption),
      isActive: filter === filterOption,
      onClick: () => onFilterChange(filterOption)
    }));
  }, [filter, onFilterChange, capitalizeFirstLetter]);

  return (
    <div className="todo-filters">
      <div className="filter-group">
        {/* Отображаем кнопки для каждого фильтра */}
        {filterHandlers.map(({ filter, label, isActive, onClick }) => (
          <button
            key={filter}
            className={isActive ? 'active' : ''}
            onClick={onClick}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
});

// Имя для отладки в React DevTools
TodoFilters.displayName = 'TodoFilters';

export default TodoFilters; 