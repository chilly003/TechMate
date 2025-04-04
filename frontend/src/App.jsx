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
  const token = localStorage.getItem('accessToken');

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/open" />;
    }
    return children;
  };

  // Redirect to home if already logged in
  const PublicRoute = ({ children }) => {
    if (token) {
      return <Navigate to="/home" />;
    }
    return children;
  };

  return (
    <Router>
      <div>
        {token && <Header />}
        <div>
          <Routes>
            {/* Public routes with redirect if logged in */}
            <Route path="/" element={
              <PublicRoute>
                <OpenPage />
              </PublicRoute>
            } />
            <Route path="/open" element={
              <PublicRoute>
                <Intro />
              </PublicRoute>
            } />
            <Route path="/auth" element={<KakaoCallback />} />
            <Route path="/auth/google" element={<GoogleCallback />} />

            {/* Protected routes */}
            <Route path="/home" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/userprofile" element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/article/:id" element={
              <ProtectedRoute>
                <ArticlePage />
              </ProtectedRoute>
            } />
            <Route path="/mypage" element={
              <ProtectedRoute>
                <Mypage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
