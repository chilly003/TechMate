import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      sendCodeToBackend(code);
    }
  }, []);

  const sendCodeToBackend = async (code) => {
    try {
      const response = await axios.post('백엔드_API_주소/kakao/login', { code });
      // 로그인 성공 처리
      console.log('로그인 성공:', response.data);
      navigate('/home'); 
    } catch (error) {
      console.error('로그인 실패:', error);
      navigate('/'); 
    }
  };

  return <div>카카오 로그인 처리 중...</div>;
};

export default KakaoCallback;
