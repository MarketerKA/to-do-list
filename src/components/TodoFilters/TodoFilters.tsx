import { memo, useCallback, useMemo } from 'react';
import { TodoFilter } from '../../types';
import './TodoFilters.scss';

type TodoFiltersProps = {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

const FILTERS: TodoFilter[] = ['all', 'active', 'completed'];

const TodoFilters = memo(({ filter, onFilterChange }: TodoFiltersProps) => {
  // Мемоизируем функцию капитализации фильтра
  const capitalizeFirstLetter = useCallback((string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }, []);

  // Создаем обработчики для каждого фильтра
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

TodoFilters.displayName = 'TodoFilters';

export default TodoFilters; 