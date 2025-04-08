import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/common/Header";
import Intro from "./pages/IntroPage";
import ArticlePage from "./pages/ArticlePage";
import HomePage from "./pages/HomePage";
import Mypage from "./pages/MyPage";
import UserProfilePage from "./pages/UserProfilePage";
import OpenPage from "./pages/OpenPage";
import KakaoCallback from "./pages/KakaoCallback";
import GoogleCallback from "./pages/GoogleCallback";
import ProtectedRoute from "./pages/ProtectedRoute"; // Route Guard 컴포넌트

function App() {

  return (
    <Router>
      <div>
          <Routes>
            {/* 엑세스 토큰 여부와 상관없이 접근 가능한 경로 */}
            <Route path="/" element={<OpenPage />} />
            <Route path="/open" element={<Intro />} />
            <Route path="/userprofile" element={<UserProfilePage />} />
            <Route path="/auth" element={<KakaoCallback />} />
            <Route path="/auth/google" element={<GoogleCallback />} />

            {/* 엑세스 토큰이 필요할 때만 접근 가능한 경로 */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <>
                  <Header />
                  <HomePage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/article/:id"
              element={
                <ProtectedRoute>
                  <>
                  <Header />
                  <ArticlePage />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/mypage"
              element={
                <ProtectedRoute>
                  <>
                  <Header />
                  <Mypage />
                  </>
                </ProtectedRoute>
              }
            />
          </Routes>
      </div>
    </Router>
  );
}

export default App;
