import React from 'react';
import { useNavigate } from 'react-router-dom';
import IntroImage from '../../assets/images/IntroImage.jpg';

const MainArticle = ({ imageUrl, category, title, content, id }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/article/${id}`);
    };

    return (
        <div 
            className="relative w-full h-full cursor-pointer hover:brightness-90 transition-all duration-300" 
            onClick={handleClick}
        >
            {/* Background Image */}
            <img
                src={IntroImage}
                alt="Article background"
                className="w-full h-full object-cover brightness-75"
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                {/* Category Tag */}
                <div className="mb-4">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                        {category || '통신/뉴미디어'}
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-4xl font-bold mb-3 line-clamp-2">
                    {title || '[MWC] LGU+ \'AI 에이전트 익시오\' 중동진출..."현지 최대통신사와 협력"'}
                </h2>

                {/* Content Preview */}
                <p className="text-sm md:text-base opacity-90 line-clamp-2">
                    {content || '자회사그룹과 MWC 2025사업 업무협약...사우디에 연내 및 출시 목표'}
                </p>
            </div>
        </div>
    );
};

export default MainArticle;
