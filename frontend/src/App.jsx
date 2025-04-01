import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Intro from './pages/IntroPage';
import ArticlePage from './pages/ArticlePage';
// import ArticlePage from './pages/articlepage';
import HomePage from './pages/HomePage';
import Mypage from './pages/MyPage';
import UserProfilePage from './pages/UserProfilePage';
import KakaoCallback from './pages/KakaoCallback';

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
            <Route path="/auth" element={<KakaoCallback />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
