import { TodoFilter } from '../../types';
import './TodoFilters.scss';

type TodoFiltersProps = {
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

const FILTERS: TodoFilter[] = ['all', 'active', 'completed'];

const TodoFilters = ({ filter, onFilterChange }: TodoFiltersProps) => {
  return (
    <div className="todo-filters">
      <div className="filter-group">
        {FILTERS.map(filterOption => (
          <button
            key={filterOption}
            className={filter === filterOption ? 'active' : ''}
            onClick={() => onFilterChange(filterOption)}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TodoFilters; 