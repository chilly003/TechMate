import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * @description 사용자 프로필 설정 페이지
 * 
 * @todo [프로그레스 바] 현재 진행 단계를 보여주는 상단 프로그레스 바 구현
 * @todo [프로그레스 바] 구현 방식: 3단계(닉네임 입력 > 선호 기사 선택 > 완료)를 시각적으로 표시
 * 
 * @todo [닉네임 입력] 사용자 닉네임 입력 폼 구현
 * @todo [닉네임 입력] 구현 방식: input 태그와 유효성 검사
 * @todo [닉네임 입력] 요구사항: 닉네임 규칙 충족 시에만 다음 단계 진행 가능
 * 
 * @todo [선호 기사 선택] 4가지 기사 타입 중 1개 선택 구현
 * @todo [선호 기사 선택] 구현 방식: radio 버튼 또는 카드 형태의 선택 UI
 * @todo [선호 기사 선택] 요구사항: 반드시 1개 선택해야 다음 단계 진행 가능
 * 
 * @todo [완료 화면] 프로필 설정 완료 화면 구현
 * @todo [완료 화면] 구현 방식: 축하 메시지와 메인 페이지 이동 버튼
 * @todo [완료 화면] 요구사항: 애니메이션 효과로 완료 상태 표시
 */

const UserProfilePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div>
            <h1>User Profile</h1>
        </div>
    );
};

export default UserProfilePage;
