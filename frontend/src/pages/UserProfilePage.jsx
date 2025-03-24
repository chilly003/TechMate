import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleCard from '../components/article/ArticleCard';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import '../styles/Logo.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRandomArticles } from '../store/slices/userProfileSlice';

const UserProfilePage = () => {
    const navigate = useNavigate();
    // const dispatch = useDispatch(); 
    const [step, setStep] = useState(1);
    const [nickname, setNickname] = useState('');
    const [selectedArticle, setSelectedArticle] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedArticles, setSelectedArticles] = useState([]);
    const [isTransitioning, setIsTransitioning] = useState(false);  // Add this line
    const [slideDirection, setSlideDirection] = useState('left');   // Add this line if needed


    // 프로그레스 바 단계 정보 추가
    const steps = [
        { number: 1, text: '닉네임 입력' },
        { number: 2, text: '선호 기사 선택' },
        { number: 3, text: '가입 완료' }
    ];

    // 닉네임 유효성 검사 (1자 이상 20자 이하)
    const isNicknameValid = nickname.length >= 1 && nickname.length <= 20;
    const articles = [
        { id: 1, title: 'IT/과학' },
        { id: 2, title: '경제' },
        { id: 3, title: '사회' },
        { id: 4, title: '생활/문화' },
        { id: 5, title: '정치' },
        { id: 6, title: '스포츠' },
        { id: 7, title: '연예' },
        { id: 8, title: '국제' },
        { id: 9, title: '교육' },
        { id: 10, title: '통신' },
        { id: 11, title: '보안' },
        { id: 12, title: '프론트' },
    ];

    const articlesPerPage = 4;
    const totalPages = Math.ceil(articles.length / articlesPerPage);

    const handleArticleSelect = (articleId) => {
        setIsTransitioning(true);
        
        const currentPageArticles = articles.slice(currentPage * articlesPerPage, (currentPage + 1) * articlesPerPage);
        const otherPagesSelections = selectedArticles.filter(id => 
            !currentPageArticles.map(a => a.id).includes(id)
        );
        
        setSelectedArticles([...otherPagesSelections, articleId]);
        
        if (selectedArticles.length < 2) {  // 2개 선택할 때까지
            setTimeout(() => {
                setCurrentPage(prev => prev + 1);
                setIsTransitioning(false);
            }, 500);
        } else {
            setTimeout(() => {
                setStep(prev => prev + 1);
                setIsTransitioning(false);
            }, 500);
        }
    };

    const handleNext = () => {
        if (step === 1) {
            if (!isNicknameValid) return;
            setStep(prev => prev + 1);
            // dispatch(fetchRandomArticles(nickname))
            //     .unwrap()
            //     .then(() => {
            //         setStep(prev => prev + 1);
            //     })
            //     .catch((err) => {
            //         console.error('랜덤 기사 조회 실패:', err);
            //     });
            return;
        }
        
        if (step === 2) {
            if (currentPage < totalPages - 1) {
                setCurrentPage(prev => prev + 1);
                return;
            } else if (selectedArticles.length === 0) {
                return;
            }
        }
        setStep(prev => prev + 1);
    };

    // 홈으로 이동
    const handleGoHome = () => {
        navigate('/home');
    };

    return (
        <div className="min-h-screen flex flex-col items-center pt-14">
            {/* 프로그레스 바 */}
            <div className="w-full max-w-3xl px-4 pt-5 mb-8">
                <div className="flex justify-between items-center relative">
                    {steps.map((s, index) => (
                        <div key={s.number} className="flex flex-col items-center relative z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s.number ? 'bg-[#1B2C7A] text-white' : 'bg-gray-200'
                                }`}>
                                {s.number}
                            </div>
                            <span className="mt-2 text-sm">{s.text}</span>
                        </div>
                    ))}
                    {/* 연결선 */}
                    <div className="absolute top-4 left-[5%] right-[5%] h-[2px] bg-gray-200 -z-0">
                        <div
                            className="h-full bg-[#1B2C7A] transition-all duration-300"
                            style={{ width: `${((step - 1) / 2) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* 단계별 컨텐츠 */}
            <div className="w-full max-w-6xl px-4 py-8">
                {step === 1 && (
                    <div className="text-center max-w-xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8">사용하실 닉네임을 입력해 주세요</h2>
                        <div className="relative">
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full p-4 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600"
                                placeholder="닉네임을 입력해 주세요. (1-20자)"
                                maxLength={20}
                            />
                            {nickname && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    {isNicknameValid ? "✓" : "✗"}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-bold">흥미로운 기사를 선택해주세요</h2>
                            <p className="text-gray-600 mt-2">
                                {currentPage + 1}번째 선호 기사를 선택해주세요 ({selectedArticles.length}/3)
                            </p>
                        </div>
                        
                        <div className="max-w-6xl mx-auto px-4 relative">
                            <div 
                                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-300
                                    ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
                            >
                                {articles
                                    .slice(currentPage * articlesPerPage, (currentPage + 1) * articlesPerPage)
                                    .map((article) => (
                                        <div
                                            key={article.id}
                                            onClick={(e) => {
                                                if (!isTransitioning && selectedArticles.length < 3) {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleArticleSelect(article.id);
                                                }
                                            }}
                                            className={`cursor-pointer transition-all duration-300 w-full rounded-lg overflow-hidden p-4
                                                ${selectedArticles.includes(article.id) 
                                                    ? 'ring-4 ring-[#1B2C7A] bg-blue-50 scale-105' 
                                                    : selectedArticles.length >= 3 
                                                        ? 'opacity-50 cursor-not-allowed'
                                                        : 'hover:shadow-lg hover:scale-102'
                                                }`}
                                        >
                                            <div className="w-full mx-auto pointer-events-none">
                                                <div className="[&>div>div>div:first-child]:text-sm [&>div>div>div:not(:first-child)]:hidden [&>div>div>h3]:hidden">
                                                    <ArticleCard id={article.id} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        {/* <div className="flex justify-between items-center mt-8">
                            <span className="text-sm text-gray-500">
                                {currentPage + 1} / {totalPages} 페이지
                            </span>
                            <div className="flex gap-2">
                                {currentPage > 0 && (
                                    <button
                                        onClick={() => setCurrentPage(prev => prev - 1)}
                                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    >
                                        이전
                                    </button>
                                )}
                                {currentPage < totalPages - 1 && (
                                    <button
                                        onClick={() => setCurrentPage(prev => prev + 1)}
                                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                                    >
                                        다음
                                    </button>
                                )}
                            </div>
                        </div> */}
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center max-w-xl mx-auto">
                        <h2 className="text-2xl font-bold mb-10 mt-10">정보 입력이 완료되었어요!</h2>
                        <div className="inline-block">
                            <h1 
                                onClick={handleGoHome}
                                className="mt-8 text-6xl font-bold cursor-pointer bg-gradient-to-r from-[#72B7CA] to-[#1B2C7A] text-transparent bg-clip-text
                                tech-logo"
                            >
                                TechMate
                            </h1>
                        </div>
                    </div>
                )}

                {step == 1 && (
                    <div className="max-w-xl mx-auto">
                        <button
                            onClick={handleNext}
                            disabled={step === 1 ? !isNicknameValid : !selectedArticle}
                            className={`mt-8 w-full py-3 rounded-lg ${step === 1 && isNicknameValid
                                ? 'bg-[#1B2C7A] text-white'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            다음
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;
