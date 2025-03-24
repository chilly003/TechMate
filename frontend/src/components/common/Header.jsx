import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { RiMenu3Line } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';
import { FaRegUser, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    // 메뉴 열림 상태에 따른 스크롤 제어
    // const [scrollbarWidth, setScrollbarWidth] = useState(0);

    // useEffect(() => {
    //     if (isMenuOpen) {
    //         const scrollWidth = window.innerWidth - document.documentElement.clientWidth;
    //         setScrollbarWidth(scrollWidth);
    //         document.body.style.paddingRight = `${scrollWidth}px`;
    //         document.body.style.overflow = 'hidden';
    //     } else {
    //         setScrollbarWidth(0);
    //         document.body.style.paddingRight = '0px';
    //         document.body.style.overflow = 'unset';
    //     }

    //     return () => {
    //         setScrollbarWidth(0);
    //         document.body.style.paddingRight = '0px';
    //         document.body.style.overflow = 'unset';
    //     };
    // }, [isMenuOpen]);

    const handleSearch = (e) => {
        e.preventDefault();
        // TODO: 검색 로직 구현
        console.log('Search term:', searchTerm);
        setSearchTerm('');
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'
                    }`}
            >
                <div className="max-w-[2000px] mx-auto px-8 md:px-12 h-24 flex items-center justify-between">
                    <Link to="/Home" className="inline-flex items-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                            TechMate
                        </h1>
                    </Link>

                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className={`p-1 hover:bg-gray-100/10 rounded-full transition-colors ${isMenuOpen ? 'opacity-0' : 'opacity-100'
                            }`}
                    >
                        <RiMenu3Line className="text-2xl" />
                    </button>
                </div>
            </header>

            {/* 사이드 패널 */}
            <div
                className={`fixed top-0 right-0 h-screen bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[200] w-full md:w-1/2 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col justify-between">
                    <div className="px-4 md:px-10 py-6">
                        {/* 닫기 버튼 */}
                        <div className="flex justify-end mb-4 md:mb-6">
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <IoClose className="text-xl md:text-2xl" />
                            </button>
                        </div>

                        {/* 메뉴 내용 */}
                        <div className="px-4 md:px-20 pt-2 md:pt-5">
                            {/* 검색바 */}
                            <div className="flex-1 relative border-b-2 border-black pb-2 md:pb-3">
                                <form onSubmit={handleSearch} className="flex items-center">
                                    <FiSearch className="text-xl md:text-2xl" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="검색어를 입력하세요"
                                        className="w-full ml-2 outline-none bg-transparent text-sm md:text-base"
                                    />
                                </form>
                            </div>
                            <ul className="pt-8 md:pt-12 space-y-5 md:space-y-7">
                                {['전체', 'IT 일반', '모바일', 'SNS', '통신', '보안', 'AI', '게임'].map((item) => (
                                    <li key={item}>
                                        <Link
                                            to={`/category/${item}`}
                                            className="block text-lg md:text-2xl font-medium hover:font-bold transition-all"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 하단 버튼 영역 */}
                        <div className="px-4 md:px-6 flex justify-end gap-2 mt-8 md:mt-0">
                            <Link to="/mypage">
                                <button className='p-2 md:p-3 hover:bg-gray-100 rounded-full transition-colors'>
                                    <FaRegUser className="text-xl md:text-2xl" />
                                </button>
                            </Link>
                            <button
                                onClick={() => {/* TODO: 로그아웃 처리 */ }}
                                className='p-2 md:p-3 hover:bg-gray-100 rounded-full transition-colors'
                            >
                                <FaSignOutAlt className="text-xl md:text-2xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;