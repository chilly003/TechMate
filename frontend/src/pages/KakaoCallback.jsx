import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) handleKakaoLogin(code);
    console.log(code);
  }, []);

  const handleKakaoLogin = async (code) => {
    try {
      // 1. 회원 여부 확인 요청
      const validationResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/credentials/oauth/valid/register`,
        {
          params: {
            code: code,       // 인가 코드 직접 전달
            provider: 'KAKAO' // 공급자 명시
          }
        }
      );
    
      // 2. 응답 구조 분해 할당
      const { 
        isRegistered, 
        idToken 
      } = validationResponse?.data.data;
      console.log(isRegistered, idToken)

      if (!isRegistered) {
        console.log('[회원가입 필요] idToken:', idToken); // 디버깅용 로그
        // 회원가입 페이지로 이동하며 idToken 전달
        navigate('/userprofile', { state: { idToken } });
      } else {
        console.log('[로그인 성공]'); // 디버깅용 로그
        // 로그인 API 요청
        const authResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/credentials/login`,
          null,
          {
            params: {
              idToken: idToken,
              provider: 'KAKAO'
            }
          }
        );
  
        localStorage.setItem('accessToken', authResponse.data.accessToken);
        navigate('/home');
      }
    } catch (error) {
      console.error('API 호출 실패:', {
        status: error.response?.status,
        data: error.response?.data
      });
      navigate('/');
    }
  };

  return <div>카카오 로그인 중...</div>;
};

export default KakaoCallback;
