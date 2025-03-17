import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @description 서비스 대문 페이지, 소개 문구 및 소셜 로그인 버튼 등을 보여준다.
 * 
 * @todo [대문 이미지] 구현 필요
 * @todo [대문 이미지] 구현 방식: [img 태그 활용하여 이미지 불러오기]
 * @todo [대문 이미지] 요구사항: [좌측 50%를 차지하며, 768px 이하 일때는 이미지가 노출 되지 아니한다]
 * 
 * @todo [타이틀 및 소셜 로그인 버튼 부] 구현 필요
 * @todo [타이틀 및 소셜 로그인 버튼 부] 구현 방식: [Title은 자유, 소셜 로그인 버튼은 버튼 태그로 구현 혹은 컴포넌트를 불러온다.]
 * @todo [타이틀 및 소셜 로그인 버튼 부] 요구사항: [우측 50%를 차지하며, 768px 이하 일때는 전체를 차지한다.]
 */

const Intro = () => {
    const navigate = useNavigate();

    return (
        <div>
            IntroPage
        </div>
    );
};

export default Intro;
