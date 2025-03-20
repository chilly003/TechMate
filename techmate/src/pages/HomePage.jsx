import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainArticle from '../components/article/MainArticle';
import ArticleCard from '../components/article/ArticleCard';

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

    // Create array of articles with alternating featured articles
    const dummyArticles = Array.from({ length: 50 }, (_, index) => ({
        id: index + 1,
        title: index % 10 === 0
            ? "삼성전자, AI 반도체로 새로운 시장 개척 나서"
            : "김영진 KT 대표 \"호텔 부문선, 본업 아냐...매각해 통신·AI 투자\"[MWC25]",
        publisher: index % 2 === 0 ? "IT/일반" : "통신",
        isFeatured: index % 10 === 0, // Every 10th article is featured
        content: "자회사그룹과 MWC 2025사업 업무협약...사우디에 연내 및 출시 목표",
        category: index % 3 === 0 ? "테크" : index % 3 === 1 ? "경제" : "산업"
    }));

    return (
        <div className="flex flex-col">
            {dummyArticles.map((article, index) => (
                article.isFeatured ? (
                    // Featured Article Section with alternating layout
                    <div key={article.id}
                        className={`flex flex-col md:flex-row min-h-screen ${Math.floor(index / 10) % 2 === 1 ? 'bg-gray-50' : ''
                            }`}
                    >
                        {/* Featured Article - alternating position */}
                        <div className={`
                            w-full h-[50vh] md:w-1/2 md:h-screen md:sticky md:top-0
                            ${Math.floor(index / 10) % 2 === 1 ? 'order-1 md:order-2' : ''}
                        `}>
                            <MainArticle
                                id={article.id}
                                title={article.title}
                                category={article.category}
                                content={article.content}
                            />
                        </div>

                        {/* Regular Articles Grid - alternating position */}
                        <div className={`
                            w-full md:w-1/2 min-h-screen p-4 bg-gray-100
                            ${Math.floor(index / 10) % 2 === 1 ? 'order-2 md:order-1' : ''}
                        `}>
                            <div className="grid grid-cols-2">
                                {dummyArticles
                                    .slice(index + 1, index + 9)
                                    .map((regularArticle, idx) => (
                                        <div
                                            key={regularArticle.id}
                                            className={`${idx % 2 === 1 ? 'mt-10 md:mt-24' : 'mt-2'}`}
                                        >
                                            <ArticleCard
                                                id={regularArticle.id}
                                                title={regularArticle.title}
                                                publisher={regularArticle.publisher}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                ) : null
            ))}
        </div>
    );
};

export default HomePage;
