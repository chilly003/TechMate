import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import IntroImage from '../assets/images/IntroImage.jpg';
import ListImage from '../assets/images/list1.jpg';  // Changed fro
import ArticleCard from '../components/article/ArticleCard';

const ArticlePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [avgColor, setAvgColor] = useState({ r: 128, g: 128, b: 128 });
    const [textColor, setTextColor] = useState('text-black');
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);  // Add this state

    useEffect(() => {
        // Calculate average color from image
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = ListImage;  // Changed back to IntroImage

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let r = 0, g = 0, b = 0;

            for (let i = 0; i < imageData.length; i += 4) {
                r += imageData[i];
                g += imageData[i + 1];
                b += imageData[i + 2];
            }

            const pixels = imageData.length / 4;
            const avgR = r / pixels;
            const avgG = g / pixels;
            const avgB = b / pixels;

            setAvgColor({ r: avgR, g: avgG, b: avgB });

            // Calculate brightness using relative luminance formula
            const brightness = (0.299 * avgR + 0.587 * avgG + 0.114 * avgB) / 255;
            setTextColor(brightness > 0.5 ? 'text-black' : 'text-white');
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.pageYOffset;
            setScrollPosition(position);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const sharedStyle = {
        filter: `brightness(${Math.max(0.6, 1 - scrollPosition * 0.002)})`,
    };

    const imageStyle = {
        transform: `scale(${1 + scrollPosition * 0.0008})`,
        ...sharedStyle
    };

    return (
        <div className="relative">
            {/* Floating Button */}
            <button
                onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                className="fixed bottom-8 right-8 z-50 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 md:right-8"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>

            {/* Side Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-8">
                    <button
                        onClick={() => setIsSidePanelOpen(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h2 className="text-2xl font-bold mb-4">Side Panel Content</h2>
                    <p>Your content goes here...</p>
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
                        <div className="px-8 md:px-16 max-w-2xl relative z-10">
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
                            <div className={`w-full px-8 py-16 md:py-24 ${isSidePanelOpen ? 'md:px-8' : 'md:w-[50%] md:px-0'
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
