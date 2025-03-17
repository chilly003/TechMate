import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * @description 기사 상세 페이지, 기사의 상세 내용을 보여주는 페이지.
 * 
 * @todo [상단부] 구현 필요
 * @todo [상단부] 구현 방식: [img 태그, text 태그 활용]
 * @todo [상단부] 요구사항: [좌측 50%는 기사 대표이미지, 우측 50%는 기사 내용이 나타난다.]
 * @todo [상단부] 요구사항: [768px 이하 일때는 이미지를 배경으로 기사 내용이 나타난다.]
 * 
 * @todo [기사 내용 부] 구현 필요
 * @todo [기사 내용 부] 구현 방식: [text 태그 활용]
 * @todo [기사 내용 부] 요구사항: [문단 별로 구분되어 나타난다.]
 * 
 * @todo [관련 기사 목록 부] 구현 필요
 * @todo [관련 기사 목록 부] 구현 방식: [자유]
 * @todo [관련 기사 목록 부] 요구사항: [Article 컴포넌트를 불러와 목록 형태로 가로로 나타낸다]
 * @todo [관련 기사 목록 부] 요구사항: [드래그로 목록을 넘길 수 있어야 한다.]
 * 
 * @todo [퀴즈 관련] 구현 필요
 * @todo [퀴즈 관련] 구현 방식: [자유]
 * @todo [퀴즈 관련] 요구사항: [퀴즈 풀러가기 버튼을 누르면 Quiz 컴포넌트가 나타난다.]
 * @todo [퀴즈 관련] 요구사항: [퀴즈 컴포넌트는 우측 50%를 차지하게 된다.]
 * 
 * @todo [메모 및 스크랩 관련] 구현 필요
 * @todo [메모 및 스크랩 관련] 구현 방식: [자유]
 * @todo [메모 및 스크랩 관련] 요구사항: [사용자가 스크랩한 기사 일 경우 메모가 가능해야한다.]
 * @todo [메모 및 스크랩 관련] 요구사항: [Memo 컴포넌트를 불러와 메모를 할 수 있다.]
 * @todo [메모 및 스크랩 관련] 요구사항: [Memo 컴포넌트는 열고 닫을 수 있어야 한다.]
 * @todo [메모 및 스크랩 관련] 요구사항: [Memo 컴포넌트는 열려있을 경우 우측 50%를 차지하게 된다.]
 * 
 */

const ArticlePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div>
            Articlepage.
        </div>
    );
};

export default ArticlePage;
