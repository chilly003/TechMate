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
       `${import.meta.env.VITE_API_BASE_URL}/v1/credentials/oauth/valid/register`,
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
      } = validationResponse.data.data;
  
      // 3. 회원가입/로그인 분기 처리
      const endpoint = isRegistered ? '/login' : '';
      const authResponse = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}api/v1/credentials${endpoint}`,
        null,
        {
          params: {
            idToken: idToken,
            provider: 'KAKAO'
          }
        }
      );
  
      localStorage.setItem('accessToken', authResponse.data.accessToken);
      navigate(isRegistered ? '/home' : '/userprofile');
      
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
