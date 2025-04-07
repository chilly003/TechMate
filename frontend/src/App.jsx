import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Intro from './pages/IntroPage';
import ArticlePage from './pages/ArticlePage';
import HomePage from './pages/HomePage';
import Mypage from './pages/MyPage';
import UserProfilePage from './pages/UserProfilePage';
import OpenPage from './pages/OpenPage';
import KakaoCallback from './pages/KakaoCallback';
import GoogleCallback from './pages/GoogleCallback';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <div>
          <Routes>
            <Route path="/" element={<OpenPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/userprofile" element={<UserProfilePage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/open" element={<Intro />} />
            <Route path="/auth" element={<KakaoCallback />} />
            <Route path="/auth/google" element={<GoogleCallback />} />
            {/* 없는 경로는 /로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
