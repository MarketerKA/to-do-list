export type TodoItem = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
};

export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoSort = 'date'; 