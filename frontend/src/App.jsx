import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Intro from './pages/IntroPage';
import ArticlePage from './pages/ArticlePage';
import HomePage from './pages/HomePage';
import Mypage from './pages/MyPage';
import UserProfilePage from './pages/UserProfilePage';
import OpenPage from './pages/OpenPage';
import KakaoCallback from './pages/KakaoCallback';
import GoogleCallback from './GoogleCallback';
import RouteGuard from './RouteGuard'; // RouteGuard import

function App() {
  const accessToken = localStorage.getItem('accessToken');

  return (
    <Router>
      <div>
        {accessToken && <Header />} {/* Header 조건부 렌더링 */}
        <Routes>
          <Route path="/" element={<OpenPage />} />
          <Route path="/open" element={<Intro />} />

          {/* RouteGuard로 감싸기 */}
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

          {/* 엑세스 토큰이 없어도 보이는 화면 */}
          <Route path="/userprofile" element={<UserProfilePage />} />
          <Route path="/auth" element={<KakaoCallback />} />
          <Route path="/auth/google" element={<GoogleCallback />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
