import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ListImage from '../assets/images/list1.jpg';  // Changed fro
import ArticleCard from '../components/article/ArticleCard';
import Memo from '../components/article/Memo';
import FloatingButton from '../components/ui/FloatingButton';
import { FiEdit3 } from 'react-icons/fi';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsBookmark, BsFillBookmarkFill } from 'react-icons/bs';
import Modal from '../components/common/Modal';

const ArticlePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [avgColor, setAvgColor] = useState({ r: 128, g: 128, b: 128 });
    const [textColor, setTextColor] = useState('text-black');
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [isScraped, setIsScraped] = useState(false);
    const [folderName, setFolderName] = useState('');

    // Add these style definitions before the handleScrapClick function
    const sharedStyle = {
        filter: `brightness(${Math.max(0.6, 1 - scrollPosition * 0.002)})`,
    };

    const imageStyle = {
        transform: `scale(${1 + scrollPosition * 0.0008})`,
        ...sharedStyle
    };

    const handleScrapClick = () => {
        if (!isScraped) {
            // Show folder selection modal when scrapping
            setModalType('select');
            setShowModal(true);
        } else {
            // Show confirmation modal when un-scrapping
            setModalType('confirm');
            setShowModal(true);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setModalType('');
        setFolderName('');  // Reset folder name when closing modal
    };

    const handleModalConfirm = (option) => {
        if (modalType === 'select') {
            if (option.type === 'new_folder') {
                setModalType('edit');
                return;
            }
            setIsScraped(true);
            setIsSidePanelOpen(true);
            setShowModal(false);
        } else if (modalType === 'edit') {
            if (folderName.trim()) {
                setIsScraped(true);
                setIsSidePanelOpen(true);
                setShowModal(false);
            }
        } else if (modalType === 'confirm') {
            setIsScraped(false);
            setIsSidePanelOpen(false);
            setShowModal(false);
        }
    };

    return (
        <div className="relative">
            {showModal && (
                <Modal
                    type={modalType}
                    title={modalType === 'select' 
                        ? "스크랩 폴더 선택" 
                        : modalType === 'edit'
                        ? "새 폴더 만들기"
                        : "스크랩 삭제"}
                    message={modalType === 'confirm' ? "스크랩 삭제시 작성한 메모는 전체 삭제됩니다. 삭제하시겠습니까?" : null}
                    options={[
                        { label: "기본 폴더", value: "default" },
                        { label: "나만의 폴더", value: "custom" }
                    ]}
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    onClose={handleModalClose}
                    onConfirm={handleModalConfirm}
                />
            )}

            {/* Floating Buttons */}
            {isScraped && (
                <FloatingButton
                    text={<FiEdit3 size={16} className="md:w-5 md:h-5"  />}
                    color="from-blue-500 to-blue-600"
                    onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                    className={`w-10 h-10 md:w-12 md:h-12 bottom-28 right-3 md:right-8 z-50 ${isSidePanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                />
            )}
            
            <FloatingButton
                text={isLiked ? <AiFillHeart size={16} className="md:w-5 md:h-5" /> : <AiOutlineHeart size={16} className="md:w-5 md:h-5" />}
                color={isLiked ? "from-red-500 to-red-600" : "from-blue-500 to-blue-600"}
                onClick={() => setIsLiked(!isLiked)}
                className={`w-10 h-10 md:w-12 md:h-12 bottom-16 right-3 md:right-8 z-50`}
            />

            <FloatingButton
                text={isScraped ? <BsFillBookmarkFill size={16} className="md:w-5 md:h-5" /> : <BsBookmark size={16} className="md:w-5 md:h-5" />}
                color={isScraped ? "from-yellow-500 to-yellow-600" : "from-blue-500 to-blue-600"}
                onClick={handleScrapClick}
                className="w-10 h-10 md:w-12 md:h-12 bottom-4 right-3 md:right-8 z-50"
            />

            {/* Side Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[100] ${isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-full p-8 overflow-hidden">
                    <button
                        onClick={() => setIsSidePanelOpen(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="h-full">
                        <Memo />
                    </div>
                </div>
            </div>

            {/* Main Content Wrapper */}
            <div className={`transition-all duration-300 ease-in-out ${isSidePanelOpen ? 'md:w-1/2' : 'w-full'}`}>
                {/* Hero Section */}
                <div className={`fixed inset-0 flex flex-col ${isSidePanelOpen ? '' : 'md:flex-row'} h-[50vh] md:h-screen ${isSidePanelOpen ? 'md:w-1/2' : 'w-full'
                    }`}>
                    {/* Image Section */}
                    <div className={`relative w-full h-full ${isSidePanelOpen ? '' : 'md:w-1/2'} overflow-hidden`}>
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                ...imageStyle,
                                backgroundImage: `url(${ListImage})`
                            }}
                        />
                        <div className={`absolute inset-0 bg-black/50 ${isSidePanelOpen ? '' : 'md:hidden'}`} />
                    </div>

                    {/* Text Section */}
                    <div
                        className={`absolute ${isSidePanelOpen ? '' : 'md:relative'} w-full ${isSidePanelOpen ? '' : 'md:w-1/2'} h-full flex items-center ${isSidePanelOpen ? 'bg-transparent' : 'md:bg-[rgb(var(--avg-color))]'
                            }`}
                        style={{
                            ...sharedStyle,
                            '--avg-color': `${avgColor.r}, ${avgColor.g}, ${avgColor.b}`,
                        }}
                    >
                        <div className="px-8 md:px-12 max-w-2xl relative z-10">
                            <p className={`text-xl text-white font-bold ${isSidePanelOpen ? '' : 'md:' + textColor} mb-4`}>CULTURE</p>
                            <h1 className={`text-4xl md:text-7xl font-extrabold mb-6 md:mb-8 leading-tight text-white 
                                ${isSidePanelOpen ? '' : 'md:' + textColor}
                                decoration-4 underline underline-offset-8 ${isSidePanelOpen ? 'decoration-white' : 'md:decoration-current'}`}>
                                2025년 리빙/인테리어 디자인 트렌드를 한눈에, 서울리빙디자인페어
                            </h1>
                            <p className={`text-lg md:text-xl mb-4 md:mb-6 text-white ${isSidePanelOpen ? '' : 'md:' + textColor} opacity-80`}>
                                자이언트과 MWC 2025서 업무협약
                            </p>
                            <p className={`text-sm md:text-base text-white ${isSidePanelOpen ? '' : 'md:' + textColor} opacity-70`}>
                                최정상 기자
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Section - Adjust width when side panel is open */}
                <div className="relative">
                    <div className="h-[50vh] md:h-screen" />
                    <div className="relative bg-white min-h-screen z-10">
                        <div className="w-full flex justify-center">
                            <div className={`w-full px-8 py-16 md:py-24 ${isSidePanelOpen ? 'md:px-12' : 'md:w-[50%] md:px-0'
                                }`}>
                                <div className="text-left space-y-8">
                                    <p className="text-lg leading-relaxed">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    </p>
                                    {[...Array(5)].map((_, i) => (
                                        <p key={i} className="text-lg leading-relaxed">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                        </p>
                                    ))}
                                </div>

                                {/* Related Articles Section */}
                                <div className="mt-16">
                                    <hr className="border-t border-gray-200 mb-12" />
                                    <h2 className="text-2xl font-bold mb-8">연관 기사</h2>
                                    <div className="relative">
                                        <div className="overflow-x-auto pb-4 hide-scrollbar">
                                            <div className="flex gap-6 w-max">
                                                {[...Array(6)].map((_, i) => (
                                                    <div key={i} className="w-[300px] flex-shrink-0 cursor-pointer group">
                                                        <ArticleCard id={2} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticlePage;
