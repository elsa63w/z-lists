import { CategorySection } from './components/CategorySection';
import './styles/globals.css';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">個人工作清單</h1>
        <p className="app__subtitle">管理工作、學習與生活任務</p>
      </header>
      <main className="app__main">
        <CategorySection category="work" title="工作" icon="💼" />
        <CategorySection category="study" title="學習" icon="📚" />
        <CategorySection category="life" title="生活" icon="🏠" />
      </main>
    </div>
  );
}

export default App;
