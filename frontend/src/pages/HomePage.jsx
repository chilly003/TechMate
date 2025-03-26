import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MainArticle from '../components/article/MainArticle';
import ArticleCard from '../components/article/ArticleCard';
import MainArticleSkeleton from '../components/article/MainArticleSkeleton';
import ArticleCardSkeleton from '../components/article/ArticleCardSkeleton';
import { fetchRecommendArticles } from '../store/slices/articleSilce';

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const articles = useSelector((state) => state.article.articles || []);
    const loading = useSelector((state) => state.article.loading);
    const error = useSelector((state) => state.article.error);
    const hasMore = useSelector((state) => state.article.hasMore);
    const currentPage = useSelector((state) => state.article.currentPage);

    // Create sections of articles (10 articles per section)
    const sections = [];
    for (let i = 0; i < articles.length; i += 10) {
        sections.push(articles.slice(i, Math.min(i + 10, articles.length)));
    }

    // Intersection Observer for infinite scroll
    const observer = useRef();
    const lastArticleElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                // Pass the current page number
                dispatch(fetchRecommendArticles(currentPage));
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, currentPage]);

    useEffect(() => {
        dispatch(fetchRecommendArticles(0));
    }, [dispatch]);

    if (error) return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;

    return (
        <div className="flex flex-col">
            {loading && sections.length === 0 ? (
                // Initial loading skeleton
                <div className="flex flex-col md:flex-row min-h-screen">
                    <div className="w-full h-[50vh] md:w-1/2 md:h-screen md:sticky md:top-0">
                        <MainArticleSkeleton />
                    </div>
                    <div className="w-full md:w-1/2 min-h-screen p-4 bg-gray-100">
                        <div className="grid grid-cols-2">
                            {[...Array(8)].map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`${idx % 2 === 1 ? 'mt-10 md:mt-28' : 'mt-2'}`}
                                >
                                    <ArticleCardSkeleton />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                // Actual content
                sections.map((section, sectionIndex) => {
                    const mainArticle = section[0];
                    const regularArticles = section.slice(1);

                    return (
                        <div
                            key={`section-${sectionIndex}-${mainArticle.articleId}`}
                            className={`flex flex-col md:flex-row min-h-screen ${sectionIndex % 2 === 1 ? 'bg-gray-50' : ''
                                }`}
                        >
                            <div className={`
                                w-full h-[50vh] md:w-1/2 md:h-screen md:sticky md:top-0
                                ${sectionIndex % 2 === 1 ? 'order-2' : 'order-1'}
                            `}>
                                <MainArticle
                                    id={mainArticle.articleId}
                                    title={mainArticle.title}
                                    journal={mainArticle.journal}
                                    summary={mainArticle.summary}
                                    category={mainArticle.category}
                                    content={mainArticle.summary}
                                    imageUrl={mainArticle.thumbnailImageUrl}
                                />
                            </div>
                            <div className={`
                                w-full md:w-1/2 min-h-screen p-4 bg-gray-100
                                ${sectionIndex % 2 === 1 ? 'order-1' : 'order-2'}
                            `}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                                    {regularArticles.map((article, idx) => (
                                        <div
                                            ref={
                                                sectionIndex === sections.length - 1 &&
                                                    idx === regularArticles.length - 1 ?
                                                    lastArticleElementRef : null
                                            }
                                            key={`section-${sectionIndex}-article-${article.articleId}-${idx}`}
                                            className={`${idx % 2 === 1 ? 'sm:mt-28 md:mt-28' : 'mt-4 sm:mt-2 md:mt-2'}`}
                                        >
                                            <ArticleCard
                                                id={article.articleId}
                                                title={article.title}
                                                journal={article.journal}
                                                category={article.category}
                                                summary={article.summary}
                                                imageUrl={article.thumbnailImageUrl}
                                                datetime={article.datetime}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
            {loading && sections.length > 0 && (
                <div className="w-full p-4 text-center">Loading more articles...</div>
            )}
        </div>
    );
};

export default HomePage;
