import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FiTrendingUp, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Add this line to get current location

  const isMyPage = location.pathname === "/mypage"; // Check if current page is mypage

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출
      const response = await api.post("/credentials/logout");

      if (response.status === 200) {
        // 로그아웃 성공 시 로컬스토리지에서 토큰 삭제
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        alert("로그아웃되었습니다.");
        // 로그인 페이지로 리다이렉트
        window.location.href = "/";
      } else {
        console.error("로그아웃 실패:", response.statusText);
        alert("로그아웃에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("오류가 발생했습니다.");
    }
  };

  // 회원탈퇴 핸들러
  const handleWithdraw = async () => {
    try {
      // 1. OAuth Provider 확인
      const provider = await getOAuthProvider();

      // 2. 새 인가코드 발급 (팝업 방식)
      const code = await getWithdrawAuthorizationCode(provider);

      // 3. 백엔드에 탈퇴 요청
      const response = await api.delete(`/credentials?code=${code}`);

      if (response.status === 200) {
        localStorage.clear();
        alert("회원탈퇴 완료");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("탈퇴 실패:", error);
      alert(error.response?.data?.message || "오류 발생");
    }
  };

  // OAuth Provider 확인 함수
  const getOAuthProvider = async () => {
    try {
      const response = await api.get("/users/nickname");
      if (response.status === 200 && response.data.success) {
        return response.data.data.oauthProvider.toLowerCase(); // "KAKAO" → "kakao", "GOOGLE" → "google"
      } else {
        throw new Error("OAuth Provider 정보를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("OAuth Provider 확인 실패:", error);
      throw new Error("OAuth Provider 확인 중 오류가 발생했습니다.");
    }
  };

  const getWithdrawAuthorizationCode = (provider) => {
    return new Promise((resolve, reject) => {
      // 인증 URL 생성
      let authUrl;
      if (provider === "kakao") {
        authUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${
          import.meta.env.VITE_KAKAO_REST_API_KEY
        }&redirect_uri=${
          import.meta.env.VITE_API_BASE_URL
        }/auth&response_type=code`;
      } else if (provider === "google") {
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
          import.meta.env.VITE_GOOGLE_CLIENT_ID
        }&redirect_uri=${
          import.meta.env.VITE_API_BASE_URL
        }/auth/google&response_type=code&scope=openid%20profile%20email`;
      }
  
      // 팝업을 동기적으로 실행
      const popup = window.open(authUrl, "_blank", "width=500,height=600");
  
      // 팝업 차단 처리
      if (!popup) {
        reject(new Error("팝업이 차단되었습니다. 허용 후 다시 시도해주세요."));
        return;
      }
  
      // 메시지 리스너 설정
      const codeHandler = (event) => {
        if (event.origin !== import.meta.env.VITE_API_BASE_URL) return;
        if (event.data.type === "withdraw_code") {
          window.removeEventListener("message", codeHandler);
          resolve(event.data.code);
        }
      };
      window.addEventListener("message", codeHandler);
    });
  };

  // 메뉴 열림 상태에 따른 스크롤 제어
  // const [scrollbarWidth, setScrollbarWidth] = useState(0);

  // useEffect(() => {
  //     if (isMenuOpen) {
  //         const scrollWidth = window.innerWidth - document.documentElement.clientWidth;
  //         setScrollbarWidth(scrollWidth);
  //         document.body.style.paddingRight = `${scrollWidth}px`;
  //         document.body.style.overflow = 'hidden';
  //     } else {
  //         setScrollbarWidth(0);
  //         document.body.style.paddingRight = '0px';
  //         document.body.style.overflow = 'unset';
  //     }

  //     return () => {
  //         setScrollbarWidth(0);
  //         document.body.style.paddingRight = '0px';
  //         document.body.style.overflow = 'unset';
  //     };
  // }, [isMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/home?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsMenuOpen(false); // Close the menu after search
      setSearchTerm(""); // Clear the search input
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-[2000px] mx-auto px-8 md:px-12 h-24 flex items-center justify-between">
          <Link to="/Home" className="inline-flex items-center">
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight ${
                isMyPage ? "text-black" : "text-white"
              }`}
            >
              TechMate
            </h1>
          </Link>

          <button
            onClick={() => setIsMenuOpen(true)}
            className={`p-1 hover:bg-gray-100/10 rounded-full transition-colors ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 36 36"
              className={isMyPage ? "text-black" : "text-white"}
            >
              <rect x="4" y="8" width="28" height="4" fill="currentColor" />
              <rect x="4" y="16" width="28" height="4" fill="currentColor" />
              <rect x="4" y="24" width="28" height="4" fill="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      {/* 사이드 패널 */}
      <div
        className={`fixed top-0 right-0 h-screen bg-[#FDFBF7] shadow-lg transform transition-transform duration-300 ease-in-out z-[100] w-full md:w-1/2 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col justify-between">
          <div className="px-4 md:px-10 py-3">
            {/* <div className="mt-8 flex gap-4">
                            <Link
                                to="/home?category=hot"
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FiTrendingUp className="text-xl" />
                                <span className="font-medium">인기 뉴스</span>
                            </Link>
                            <Link
                                to="/home?category=recent"
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FiClock className="text-xl" />
                                <span className="font-medium">최신 뉴스</span>
                            </Link>
                        </div> */}
            {/* 닫기 버튼 */}
            <div className="flex justify-end mb-4 md:mb-6">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoClose className="text-xl md:text-2xl" />
              </button>
            </div>

            {/* 메뉴 내용 */}
            <div className="px-8 md:px-8 pt-2 md:pt-0">
              {/* 검색바 */}
              <div className="flex-1 relative border-b-2 border-black pb-2 md:pb-3">
                <form onSubmit={handleSearch} className="flex items-center">
                  <FiSearch className="text-xl md:text-2xl" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="검색어를 입력하세요"
                    className="w-full ml-2 outline-none bg-transparent text-sm md:text-base"
                  />
                </form>
              </div>

              {/* Special Categories */}
              <div className="pt-6 md:pt-8 flex flex-wrap gap-4">
                <Link
                  to="/home?category=hot"
                  className="flex items-center gap-2 text-lg font-bold text-red-500 hover:text-red-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiTrendingUp className="text-xl" />
                  인기 뉴스
                </Link>
                <Link
                  to="/home?category=recent"
                  className="flex items-center gap-2 text-lg font-bold text-blue-500 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiClock className="text-xl" />
                  최신 뉴스
                </Link>
              </div>

              {/* Regular Categories */}
              <ul className="pt-6 pb-26 md:pt-8 space-y-4 md:space-y-3">
                {[
                  "전체",
                  "IT 일반",
                  "모바일",
                  "SNS",
                  "통신",
                  "보안",
                  "AI",
                  "게임",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      to={`/home?category=${item === "전체" ? "all" : item}`}
                      className="block text-h3 md:text-h2 font-black hover:text-gray-600 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="px-4 md:px-6 flex justify-end gap-2 mt-8 md:mt-0">
              <Link to="/mypage" onClick={() => setIsMenuOpen(false)}>
                <p className="block text-h4 md:text-h5 font-['Pretendard-Black'] hover:text-gray-600 transition-all">
                  마이페이지
                </p>
              </Link>
              <p> | </p>
              <p
                onClick={handleLogout}
                className="block text-h4 md:text-h5 font-['Pretendard-Black'] hover:text-gray-600 transition-all"
              >
                로그아웃
              </p>
              <p> | </p>
              <p
                onClick={handleWithdraw}
                className="block text-h4 md:text-h5 font-['Pretendard-Black'] hover:text-gray-600 transition-all"
              >
                회원탈퇴
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
