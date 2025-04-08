import React, { useState, useEffect, useRef } from 'react';

// 개별 섹션 컴포넌트
const Section = ({ children, className }) => {
    return (
        <div className={`h-screen w-full flex items-center justify-center ${className}`}>
            {children}
        </div>
    );
};

// FullpageScroll 컴포넌트
const FullpageScroll = ({ children }) => {
    const [currentSection, setCurrentSection] = useState(0);
    const containerRef = useRef(null);
    const isScrolling = useRef(false);
    const timeoutRef = useRef(null);

    // 실제 자식 요소만 필터링 (유효한 React 요소인지 확인)
    const validChildren = React.Children.toArray(children).filter(
        child => React.isValidElement(child)
    );

    // 섹션 수 계산
    const sectionCount = validChildren.length;

    // 휠 이벤트 처리
    const handleWheel = (e) => {
        e.preventDefault();

        if (isScrolling.current) return;

        isScrolling.current = true;

        // 휠 방향에 따라 섹션 변경
        if (e.deltaY > 0) {
            // 아래로 스크롤
            setCurrentSection(prev => (prev < sectionCount - 1 ? prev + 1 : prev));
        } else {
            // 위로 스크롤
            setCurrentSection(prev => (prev > 0 ? prev - 1 : prev));
        }

        // 스크롤 애니메이션이 완료될 시간 후에 다시 스크롤 가능하도록 설정
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            isScrolling.current = false;
        }, 800);
    };

    // 이벤트 리스너 등록 및 제거
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
            clearTimeout(timeoutRef.current);
        };
    }, [sectionCount]);

    return (
        <div
            ref={containerRef}
            className="h-screen w-full overflow-hidden relative"
        >
            <div
                className="transition-transform duration-700 ease-in-out h-full"
                style={{ transform: `translateY(-${currentSection * 100}%)` }}
            >
                {validChildren}
            </div>

            {/* 네비게이션 인디케이터 */}
            {sectionCount > 1 && (
                <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-10">
                    {Array.from({ length: sectionCount }).map((_, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 my-2 rounded-full cursor-pointer ${currentSection === index ? 'bg-white scale-150' : 'bg-gray-400'
                                } transition-all duration-300`}
                            onClick={() => setCurrentSection(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// 외부에서 사용할 수 있도록 Section도 내보냄
FullpageScroll.Section = Section;

export default FullpageScroll;