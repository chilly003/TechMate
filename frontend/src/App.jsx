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
import GoogleCallback from './pages/GoogleCallback';

function App() {
  const accessToken = localStorage.getItem('accessToken');

  return (
    <Router>
      <div>
        {accessToken && <Header/>}
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
