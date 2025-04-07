import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    // localStorage 변경 감지 및 상태 업데이트
    const handleStorageChange = () => {
      setAccessToken(localStorage.getItem('accessToken'));
    };

    // storage 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <div>
        {accessToken && <Header />} 
        <div>
          <Routes>
            <Route path="/" element={<OpenPage />} />
            <Route path="/open" element={<Intro />} />

            {accessToken && (
              <>
                <Route path="/home" element={<HomePage />} />
                <Route path="/article/:id" element={<ArticlePage />} />
                <Route path="/mypage" element={<Mypage />} />
              </>
            )}

            <Route path="/userprofile" element={<UserProfilePage />} />
            <Route path="/auth" element={<KakaoCallback />} />
            <Route path="/auth/google" element={<GoogleCallback />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
