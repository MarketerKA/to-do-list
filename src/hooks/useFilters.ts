import { useCallback, useMemo } from 'react';
import { TodoFilter } from '../types';

// Возможные значения фильтров
export const FILTERS: TodoFilter[] = ['all', 'active', 'completed'];

type UseFiltersProps = {
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
};

/**
 * Хук для управления фильтрами
 */
export const useFilters = ({ currentFilter, onFilterChange }: UseFiltersProps) => {
  // Функция для преобразования первой буквы в заглавную
  const capitalizeFirstLetter = useCallback((string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }, []);

  // Создаем обработчики для каждого фильтра
  const filterButtons = useMemo(() => {
    return FILTERS.map(filterOption => ({
      filter: filterOption,
      label: capitalizeFirstLetter(filterOption),
      isActive: currentFilter === filterOption,
      onClick: () => onFilterChange(filterOption)
    }));
  }, [currentFilter, onFilterChange, capitalizeFirstLetter]);

  return { filterButtons };
}; 