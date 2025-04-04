import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import introImage from '../assets/images/introImage.jpg';
import '../styles/OpenPage.css';  // Add this import

const OpenPage = () => {
    const navigate = useNavigate();
    const contentRef = useRef(null);
    const phoneRef1 = useRef(null);
    const phoneRef2 = useRef(null);
    const textRef = useRef(null);
    const wallsRef = useRef([]);
    const wallContainerRef = useRef(null);

    useEffect(() => {
        // Initial animation delay
        setTimeout(() => {
            const introContainer = document.querySelector('.intro_container');
            if (introContainer) {
                introContainer.style.display = 'block';
            }
        }, 400);

        // Scroll animations
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    const elements = [
                        { ref: contentRef.current, delay: 0 },
                        { ref: phoneRef1.current, delay: 600 },
                        { ref: phoneRef2.current, delay: 1200 },
                        { ref: textRef.current, delay: 1800 }
                    ];

                    elements.forEach(({ ref, delay }) => {
                        if (ref) {
                            setTimeout(() => {
                                ref.style.opacity = '1';
                                ref.style.transform = 'translateY(0)';
                            }, delay);
                        }
                    });
                }
            },
            { threshold: 0.5 }
        );

        if (contentRef.current) {
            observer.observe(contentRef.current);
        }

        // Wall animation on scroll
        const handleScroll = () => {
            if (!wallContainerRef.current) return;

            const windowHeight = window.innerHeight;
            const difference = windowHeight - wallContainerRef.current.getBoundingClientRect().top;

            wallsRef.current.forEach(wall => {
                if (!wall) return;
                if (difference <= 150) {
                    wall.style.width = '200px';
                } else if (difference > 150 && difference < 700) {
                    wall.style.width = `${-(4 / 11) * difference + 255}px`;
                } else {
                    wall.style.width = '0px';
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <section className="min-h-screen relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src={introImage} alt="Tech background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 h-screen flex flex-col items-center justify-center">
                    <p className="title-animation text-6xl md:text-4xl font-['Pretendard-Black'] text-center text-white mb-8">
                        IT 동향 파악엔
                    </p>
                    <p className="font-['Pretendard-Black'] subtitle-animation text-4xl text-center text-white">
                        테크메이트와 함께,
                    </p>
                </div>
            </section>

            <section className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <div className="h-[800px] relative">  {/* Changed from h-[1272px] */}
                        <div ref={contentRef} className="opacity-0 transform translate-y-10 transition-all duration-1000">
                            <h2 className="text-4xl font-bold mb-8">기술 뉴스의 새로운 경험</h2>
                            <p className="text-xl text-gray-600">뉴스부터 학습까지</p>
                            <p className="text-xl text-gray-600">한번에 해결하세요</p>
                        </div>

                        <div className="flex justify-center gap-8 mt-16">
                            <div ref={phoneRef1} className="opacity-0 transform translate-y-10 transition-all duration-1000">
                                <div className="relative w-[280px] h-[560px] rounded-3xl overflow-hidden">
                                    <img src={introImage} alt="App preview 1" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 border-8 border-gray-200 rounded-3xl pointer-events-none" />
                                </div>
                            </div>
                            <div ref={phoneRef2} className="opacity-0 transform translate-y-10 transition-all duration-1000">
                                <div className="relative w-[280px] h-[560px] rounded-3xl overflow-hidden">
                                    <img src={introImage} alt="App preview 2" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 border-8 border-gray-200 rounded-3xl pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div ref={textRef} className="opacity-0 transform translate-y-10 transition-all duration-1000 mt-16 text-center">
                            <p className="text-2xl">TechMate와 함께 시작하세요</p>
                            <p className="text-xl text-gray-600 mt-4">뉴스 읽기부터 퀴즈, 메모까지</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Next section */}
            <section className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <div className="h-[400px] relative">  {/* Changed from h-[600px] */}
                        <div className="opacity-0 transform translate-y-10 transition-all duration-1000"
                            ref={el => {
                                if (el) {
                                    const observer = new IntersectionObserver(
                                        entries => {
                                            if (entries[0].isIntersecting) {
                                                el.style.opacity = '1';
                                                el.style.transform = 'translateY(0)';
                                            }
                                        },
                                        { threshold: 0.5 }
                                    );
                                    observer.observe(el);
                                }
                            }}>
                            <h2 className="text-4xl font-bold mb-8">맞춤형 학습 경험</h2>
                            <p className="text-xl text-gray-600">IT 뉴스를 읽고</p>
                            <p className="text-xl text-gray-600">퀴즈로 복습하세요</p>

                            <div className="flex justify-center items-center mt-16">
                                <div className="relative w-[800px] h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                                    <img src={introImage} alt="Learning experience" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <p className="text-white text-3xl font-bold">Interactive Learning Experience</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section className="min-h-screen relative overflow-hidden" ref={wallContainerRef}>
                <div className="absolute inset-0">
                    <img src={introImage} alt="Tech background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative h-screen flex flex-col items-center justify-center z-10 space-y-8">
                    <h2 className="text-4xl font-bold text-center text-white title-animation">새로운 IT 뉴스 경험</h2>
                    <button
                        onClick={() => navigate('/open')}
                        className="px-8 py-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors duration-300 font-semibold"
                    >
                        시작하기
                    </button>
                </div>
            </section>


            {/* Footer */}
            <footer className="w-full bg-[#111111] text-white">
                <div className="w-[95%] md:w-[90%] max-w-[2000px] mx-auto px-8 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        {/* Logo and Description */}
                        <div className="md:col-span-5 space-y-8">
                            <h2 className="text-4xl font-['Pretendard-Black']">TechMate</h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                IT 기술 뉴스를 더 쉽게,<br />
                            </p>
                        </div>

                        {/* Navigation */}
                        {/* <div className="md:col-span-3 space-y-8">
                      <h3 className="text-xl font-semibold">Navigation</h3>
                      <ul className="space-y-4">
                        <li><a href="/home" className="text-gray-400 hover:text-white transition-colors">홈</a></li>
                        <li><a href="/scrap" className="text-gray-400 hover:text-white transition-colors">스크랩</a></li>
                        <li><a href="/mypage" className="text-gray-400 hover:text-white transition-colors">마이페이지</a></li>
                      </ul>
                    </div> */}

                        {/* Contact */}
                        <div className="md:col-span-4 space-y-8">
                            <h3 className="text-xl font-semibold">Contact</h3>
                            <ul className="space-y-4">
                                <li className="text-gray-400">SSAFY 12기 공통 프로젝트</li>
                                <li className="text-gray-400">B201팀</li>
                            </ul>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="mt-16 pt-8 border-t border-gray-800">
                        <p className="text-gray-500 text-sm">
                            © 2025 TechMate. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>


        </>
    );
};

export default OpenPage;
