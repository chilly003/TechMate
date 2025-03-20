import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @description 사용자 활동 통계와 스크랩 관리를 표시하는 마이페이지 컴포넌트
 * 
 * @todo [사용자 활동 통계] 구현 필요
 * @todo [사용자 활동 통계] 구현 방법: 읽은 기사, 스크립트, 해결한 퀴즈 수 카운터 표시
 * @todo [사용자 활동 통계] 요구사항: 아이콘과 숫자가 있는 카드 형식으로 통계 표시
 * 
 * @todo [사용자 연속 기록] 구현 필요
 * @todo [사용자 연속 기록] 구현 방법: 일일 퀴즈 완료 연속 기록 표시
 * @todo [사용자 연속 기록] 요구사항: 달력 형태의 시각화와 함께 연속 기록 수 표시
 * 
 * @todo [스크랩 관리] 구현 필요
 * @todo [스크랩 관리] 구현 방법: 
 *       - 탭 기반 폴더 구성
 *       - 모달을 통한 폴더 추가 기능
 *       - 폴더 수정/삭제 옵션
 *       - Article 컴포넌트를 사용하여 리스트 형식으로 스크랩된 뉴스 표시
 * @todo [스크랩 관리] 요구사항:
 *       - 상단의 폴더 탭
 *       - 모달을 트리거하는 폴더 추가 버튼 (+)
 *       - 각 폴더의 수정/삭제 버튼
 *       - 스크롤 가능한 리스트로 렌더링되는 Article 컴포넌트
 */

const Mypage = () => {
    const navigate = useNavigate();

    return (
        <div>
            Mypage.
        </div>
    );
};

export default Mypage;
