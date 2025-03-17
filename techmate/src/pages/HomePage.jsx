import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @description 메인 페이지, 분류 별 기사를 노출하는 페이지.
 * 
 * @todo [전체] 구현 필요
 * @todo [전체] 구현 방식: [구현 방식 자유]
 * @todo [전체] 요구사항: [분류에 맞는 API를 요청해 기사 목록을 출력하고 1번 기사는 대표 기사로 분류해 노출한다.]
 * 
 * @todo [대표 기사] 구현 필요
 * @todo [대표 기사] 구현 방식: [구현 방식 자유]
 * @todo [대표 기사] 요구사항: [좌측 50%를 차지하며, 768px 이하 일때는 상단 50%를 차지한다.]
 * @todo [대표 기사] 요구사항: [이미지를 배경으로 하며, 카테고리, 제목, 내용 일부 등을 보여준다.]
 * 
 * @todo [기사 목록] 구현 필요
 * @todo [기사 목록] 구현 방식: [ArticleCard 컴포넌트를 불러와 목록 형태로 구현한다.]
 * @todo [기사 목록] 요구사항: [상단에는 기사 분류 버튼이 추가 되어야한다.]
 * @todo [기사 목록] 요구사항: [카테고리 분류 이후에는 기사 분류 버튼 자리에 카테고리가 표시된다.]
 * @todo [기사 목록] 요구사항: [우측 50%를 차지하며, 768px 이하 일때는 하단 50%를 차지한다.]
 */

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Home Page</h1>
        </div>
    );
};

export default HomePage;
