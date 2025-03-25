import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Intro from './pages/IntroPage';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import Mypage from './pages/MyPage';
import UserProfilePage from './pages/UserProfilePage';
import Quiz from './components/article/quiz';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <div> {/* Removed pt-16 padding */}
          <Routes>
            <Route path="/" element={<Intro />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/userprofile" element={<UserProfilePage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
