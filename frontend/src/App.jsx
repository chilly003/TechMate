import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Intro from './pages/IntroPage';
import ArticlePage from './pages/ArticlePage';
import HomePage from './pages/HomePage';
import Mypage from './pages/MyPage';
import UserProfilePage from './pages/UserProfilePage';
import OpenPage from './pages/OpenPage';
import KakaoCallback from './KakaoCallback';
import GoogleCallback from './GoogleCallback';
import RouteGuard from './RouteGuard';

function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  useEffect(() => {
    // localStorage에 accessToken이 변경될 때마다 상태 업데이트
    const handleStorageChange = () => {
      setAccessToken(localStorage.getItem('accessToken'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <div>
        {accessToken && <Header />}
        <Routes>
          <Route path="/" element={<OpenPage />} />
          <Route path="/open" element={<Intro />} />
          <Route
            path="/home"
            element={
              <RouteGuard>
                <HomePage />
              </RouteGuard>
            }
          />
          <Route
            path="/article/:id"
            element={
              <RouteGuard>
                <ArticlePage />
              </RouteGuard>
            }
          />
          <Route
            path="/mypage"
            element={
              <RouteGuard>
                <Mypage />
              </RouteGuard>
            }
          />
          <Route path="/userprofile" element={<UserProfilePage />} />
          <Route path="/auth" element={<KakaoCallback />} />
          <Route path="/auth/google" element={<GoogleCallback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
