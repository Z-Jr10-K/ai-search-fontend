import Weblayout from './components/layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Search from './components/search';
import Result from './components/result';
import './App.css';
function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Weblayout />}>
        <Route index element={<Search />} />
        <Route path='search/:historyId' element={<Result />} />
      </Route>
    </Routes>
  </Router>
  );
}

export default App;
