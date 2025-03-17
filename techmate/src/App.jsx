import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Intro from './pages/IntroPage';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import Mypage from './pages/Mypage';
import UserProfilePage from './pages/UserProfilePage';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/userprofile" element={<UserProfilePage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
