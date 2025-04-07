import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) handleKakaoLogin(code);
  }, []);

  const handleKakaoLogin = async (code) => {
    try {
      // 세션 스토리지에서 탈퇴 플로우인지 확인
      const isWithdrawFlow = sessionStorage.getItem("withdraw_flow") === "true";

      if (isWithdrawFlow) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/credentials`,
            {
              params: {
                code: code,
              },
              headers: {
                // 헤더 추가
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );

          // 탈퇴 성공 후 처리
          console.log("회원 탈퇴 성공");
          sessionStorage.removeItem("withdraw_flow"); // 세션 스토리지에서 플래그 제거\
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          alert("회원 탈퇴가 완료되었습니다.");
          navigate("/"); // 또는 다른 페이지로 리다이렉트
        } catch (withdrawError) {
          console.error("회원 탈퇴 API 호출 실패:", withdrawError);
          navigate("/home");
        }
      } else {
        // 1. 회원 여부 확인 요청
        const validationResponse = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/v1/credentials/oauth/valid/register`,
          {
            params: {
              code: code, // 인가 코드 직접 전달
              provider: "KAKAO", // 공급자 명시
            },
          }
        );

        // 2. 응답 구조 분해 할당
        const { isRegistered, idToken } = validationResponse?.data.data;
        // console.log(isRegistered, idToken);

        if (!isRegistered) {
        //   console.log("[회원가입 필요] idToken:", idToken); // 디버깅용 로그
          // 회원가입 페이지로 이동하며 idToken 전달
          navigate("/userprofile", {
            state: {
              idToken,
              provider: "KAKAO",
            },
          });
        } else {
          console.log("[로그인 성공]"); // 디버깅용 로그
          // 로그인 API 요청
          const authResponse = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/v1/credentials/login`,
            null,
            {
              params: {
                idToken: idToken,
                provider: "KAKAO",
              },
            }
          );

          // 3. accessToken이 있는지 확인하고 로컬 스토리지에 저장
          const accessToken = authResponse?.data?.data?.accessToken;
          if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
          } else {
            console.error("accessToken이 응답에 없습니다.");
          }
          navigate("/home");
        }
      }
    } catch (error) {
      console.error("API 호출 실패:", {
        status: error.response?.status,
        data: error.response?.data,
      });
      navigate("/");
    }
  };

  return <div></div>;
};

export default KakaoCallback;
