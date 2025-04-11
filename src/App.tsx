import TodoList from './components/TodoList/TodoList';
import './styles/main.scss';

function App() {
  return (
    <div className="app" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f0f4f8'
    }}>
      <TodoList />
    </div>
  );
}

export default App;
