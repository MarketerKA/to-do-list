import { memo } from 'react';
import { TodoFilter } from '../../types';
import { useFilters } from '../../hooks/useFilters';
import './TodoFilters.scss';

type TodoFiltersProps = {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

/**
 * Компонент фильтрации задач
 */
const TodoFilters = memo(({ filter, onFilterChange }: TodoFiltersProps) => {
  const { filterButtons } = useFilters({ 
    currentFilter: filter, 
    onFilterChange 
  });

  return (
    <div className="todo-filters">
      <div className="filter-group">
        {/* Отображаем кнопки для каждого фильтра */}
        {filterButtons.map(({ filter, label, isActive, onClick }) => (
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