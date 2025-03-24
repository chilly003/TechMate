import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MainArticle from '../components/article/MainArticle';
import ArticleCard from '../components/article/ArticleCard';
import MainArticleSkeleton from '../components/article/MainArticleSkeleton';
import ArticleCardSkeleton from '../components/article/ArticleCardSkeleton';
import { fetchArticles } from '../store/slices/articleSilce';

const HomePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { articles, loading, error } = useSelector((state) => state.article);

    useEffect(() => {
        dispatch(fetchArticles());
    }, [dispatch]);

    if (error) return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>;

    return (
        <div className="flex flex-col">
            {loading ? (
                // Skeleton loading state
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
                articles.map((article, index) => (
                    article.isFeatured ? (
                        <div key={article.article_id}
                            className={`flex flex-col md:flex-row min-h-screen ${Math.floor(index / 10) % 2 === 1 ? 'bg-gray-50' : ''
                                }`}
                        >
                            <div className={`
                                w-full h-[50vh] md:w-1/2 md:h-screen md:sticky md:top-0
                                ${Math.floor(index / 10) % 2 === 1 ? 'order-1 md:order-2' : ''}
                            `}>
                                <MainArticle
                                    id={article.article_id}
                                    title={article.title}
                                    category={article.category}
                                    content={article.content}
                                    imageUrl={article.imageUrl}
                                />
                            </div>

                            <div className={`
                                w-full md:w-1/2 min-h-screen p-4 bg-gray-100
                                ${Math.floor(index / 10) % 2 === 1 ? 'order-2 md:order-1' : ''}
                            `}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                                    {articles
                                        .slice(index + 1, index + 9)
                                        .map((regularArticle, idx) => (
                                            <div
                                                key={regularArticle.article_id}
                                                className={`${idx % 2 === 1 ? 'sm:mt-28 md:mt-28' : 'mt-4 sm:mt-2 md:mt-2'}`}
                                            >
                                                <ArticleCard
                                                    id={regularArticle.article_id}
                                                    title={regularArticle.title}
                                                    publisher={regularArticle.publisher}
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    ) : null
                ))
            )}
        </div>
    );
};

export default HomePage;
