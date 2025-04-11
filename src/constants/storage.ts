/**
 * Константы для работы с localStorage
 */

// Префикс для всех ключей localStorage
export const STORAGE_PREFIX = 'todo-app-';

// Ключи для хранения данных
export const STORAGE_KEYS = {
  TODOS: `${STORAGE_PREFIX}todos`,
  FILTER: `${STORAGE_PREFIX}filter`,
  SORT: `${STORAGE_PREFIX}sort`
}; 