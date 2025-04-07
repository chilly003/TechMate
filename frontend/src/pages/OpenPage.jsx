import React, { useEffect, useRef } from 'react';
import FullpageScroll from '../components/ui/FullPageScroll';
import { useNavigate } from 'react-router-dom';
import newsImage from '../assets/images/newsImage.jpg';
import deskImage from '../assets/images/deskImage.jpg';
import webImage from '../assets/images/webImage1.png';
import webImage2 from '../assets/images/webImage2.png';
import webImage3 from '../assets/images/webImage3.png';
import '../styles/OpenPage.css';

const ScrollArrow = () => (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-20">
        <div className="floating-arrow">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
        </div>
    </div>
);

const OpenPage = () => {
    const navigate = useNavigate();

    // Add new ref for the fourth section
    const contentRef1 = useRef(null);
    const phoneRef1 = useRef(null);
    const contentRef2 = useRef(null);
    const phoneRef2 = useRef(null);
    const contentRef3 = useRef(null);
    const phoneRef3 = useRef(null);

    // Add new refs at the top with other refs
    const lastTitleRef = useRef(null);
    const lastSubtitleRef = useRef(null);

    // Add new ref with other refs
    const lastButtonRef = useRef(null);

    useEffect(() => {
        const sectionObservers = [
            {
                trigger: contentRef1,
                targets: [
                    { ref: contentRef1.current, delay: 0 },
                    { ref: phoneRef1.current, delay: 600 },
                ]
            },
            {
                trigger: contentRef2,
                targets: [
                    { ref: contentRef2.current, delay: 0 },
                    { ref: phoneRef2.current, delay: 600 },
                ]
            },
            {
                trigger: contentRef3,
                targets: [
                    { ref: contentRef3.current, delay: 0 },
                    { ref: phoneRef3.current, delay: 600 },
                ]
            },
            {
                trigger: lastTitleRef,
                targets: [
                    { ref: lastTitleRef.current, delay: 0 },
                    { ref: lastSubtitleRef.current, delay: 600 },
                    { ref: lastButtonRef.current, delay: 1200 },
                ]
            }
        ];

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const matchedSection = sectionObservers.find(
                            section => section.trigger.current === entry.target
                        );

                        if (matchedSection) {
                            matchedSection.targets.forEach(({ ref, delay }) => {
                                if (ref) {
                                    setTimeout(() => {
                                        ref.style.opacity = '1';
                                        ref.style.transform = 'translateY(0)';
                                    }, delay);
                                }
                            });

                            observer.unobserve(entry.target); // prevent repeat
                        }
                    }
                });
            },
            { threshold: 0.3 }
        );

        sectionObservers.forEach(section => {
            if (section.trigger.current) {
                observer.observe(section.trigger.current);
            }
        });

        return () => observer.disconnect();
    }, []);

    // Update the last section
    return (
        <FullpageScroll>
            {/* First section */}
            <FullpageScroll.Section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src={newsImage} alt="Tech background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 h-screen flex flex-col items-start justify-center">
                    <p className="title-animation text-h3 md:text-h1 font-['Pretendard-Black'] text-start text-white mb-8">
                        IT 동향 파악엔
                    </p>
                    <p className="font-['Pretendard-Black'] subtitle-animation text-h3 md:text-h1 text-start text-white">
                        테크메이트와 함께,
                    </p>
                </div>
                <ScrollArrow />
            </FullpageScroll.Section>

            {/* Second section */}
            <FullpageScroll.Section className="bg-[#FFF8E7] relative">
                <div className="mx-auto px-4 h-screen flex items-center">
                    <div className="w-full flex flex-row items-center justify-center gap-12">
                        <div
                            ref={contentRef1}
                            className="opacity-0 transform translate-y-10 transition-all duration-1000 max-w-md"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">맞춤형 학습 경험</h2>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600">IT 뉴스를 읽고</p>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600">퀴즈로 복습하세요</p>
                        </div>

                        <div className="hidden md:flex max-w-md">
                            <div
                                ref={phoneRef1}
                                className="opacity-0 transform translate-y-10 transition-all duration-1000 ease-out"
                            >
                                <div className="rounded-3xl overflow-hidden">
                                    <img src={webImage} alt="App preview 2" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </FullpageScroll.Section>

            {/* Third section */}
            <FullpageScroll.Section className="bg-[#FFF8E7]">
                <div className="mx-auto px-4 h-screen flex items-center">
                    <div className="w-full flex flex-row items-center justify-center gap-12">
                        <div
                            ref={contentRef2}
                            className="opacity-0 transform translate-y-10 transition-all duration-1000 max-w-md"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">맞춤형 학습 경험</h2>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600">IT 뉴스를 읽고</p>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600">퀴즈로 복습하세요</p>
                        </div>

                        <div className="hidden md:flex max-w-md">
                            <div
                                ref={phoneRef2}
                                className="opacity-0 transform translate-y-10 transition-all duration-1000 ease-out"
                            >
                                <div className="rounded-3xl overflow-hidden">
                                    <img src={webImage2} alt="App preview 2" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FullpageScroll.Section>

            {/* Add fourth section */}
            <FullpageScroll.Section className="bg-[#FFF8E7]">
                <div className="mx-auto px-4 h-screen flex items-center">
                    <div className="w-full flex flex-row items-center justify-center gap-12">
                        <div
                            ref={contentRef3}
                            className="opacity-0 transform translate-y-10 transition-all duration-1000 max-w-md"
                        >
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">맞춤형 학습 경험</h2>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600">IT 뉴스를 읽고</p>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600">퀴즈로 복습하세요</p>
                        </div>

                        <div className="hidden md:flex max-w-md">
                            <div
                                ref={phoneRef3}
                                className="opacity-0 transform translate-y-10 transition-all duration-1000 ease-out"
                            >
                                <div className="rounded-3xl overflow-hidden">
                                    <img src={webImage3} alt="App preview 2" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FullpageScroll.Section>
            {/* Last section */}
            <FullpageScroll.Section className="relative overflow-hidden">
                <div className="absolute inset-0">
                    <img src={deskImage} alt="Tech background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 h-screen flex flex-col items-start justify-center">
                    <p ref={lastTitleRef} className="opacity-0 transform translate-y-10 transition-all duration-1000 text-h3 md:text-h1 font-['Pretendard-Black'] text-start text-white mb-8">
                        지금 바로 시작하세요
                    </p>
                    <p ref={lastSubtitleRef} className="opacity-0 transform translate-y-10 transition-all duration-1000 font-['Pretendard-Black'] text-h3 md:text-h1 text-start text-white mb-8">
                        테크메이트와 함께,
                    </p>
                    <button
                        ref={lastButtonRef}
                        onClick={() => navigate('/open')}
                        className="opacity-0 transform translate-y-10 transition-all duration-1000 px-8 py-3 bg-white text-black rounded-full text-xl hover:bg-opacity-90"
                    >
                        시작하기
                    </button>
                </div>
            </FullpageScroll.Section>
        </FullpageScroll>
    );
};

export default OpenPage;
