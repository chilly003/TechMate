import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URL(window.location.href).searchParams;
    const code = urlParams.get('code');
    const isWithdrawFlow = sessionStorage.getItem('withdraw_flow') === 'true'; // 탈퇴 플로우 확인

    if (code) {
      if (isWithdrawFlow) {
        handleKakaoWithdraw(code); // 회원탈퇴 처리
      } else {
        handleKakaoLogin(code); // 로그인 처리
      }
    }
  }, []);

  // 카카오 로그인 처리 함수
  const handleKakaoLogin = async (code) => {
    try {
      const validationResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/credentials/oauth/valid/register`,
        {
          params: {
            code: code,
            provider: 'KAKAO',
          },
        }
      );

      const { isRegistered, idToken } = validationResponse.data.data;

      if (!isRegistered) {
        console.log('[회원가입 필요] idToken:', idToken);
        navigate('/userprofile', { state: { idToken } });
      } else {
        console.log('[로그인 성공]');
        const authResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/credentials/login`,
          null,
          {
            params: {
              idToken: idToken,
              provider: 'KAKAO',
            },
          }
        );

        localStorage.setItem('accessToken', authResponse.data.accessToken);
        navigate('/home');
      }
    } catch (error) {
      console.error('로그인 API 호출 실패:', error.response?.data || error.message);
      navigate('/');
    }
  };

  // 카카오 회원탈퇴 처리 함수
  const handleKakaoWithdraw = async (code) => {
    try {
      // 탈퇴 API 요청
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/credentials`,
        {
          params: { code },
        }
      );

      if (response.status === 200) {
        console.log('[회원탈퇴 성공]');
        localStorage.clear(); // 모든 저장 데이터 삭제
        sessionStorage.removeItem('withdraw_flow'); // 탈퇴 플로우 상태 제거
        alert('회원탈퇴가 완료되었습니다.');
        navigate('/'); // 메인 페이지로 이동
      }
    } catch (error) {
      console.error('회원탈퇴 API 호출 실패:', error.response?.data || error.message);
      alert('회원탈퇴 중 오류가 발생했습니다.');
      navigate('/');
    }
  };

  return <div>카카오 처리 중...</div>;
};

export default KakaoCallback;
