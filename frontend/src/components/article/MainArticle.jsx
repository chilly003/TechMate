import React from 'react';
import { useNavigate } from 'react-router-dom';
import PeopleImage from '../../assets/images/people.jpg';

const MainArticle = ({ imageUrl, category, title, content, id }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/article/${id}`);
    };

    return (
        <div
            className="relative w-full h-full group cursor-pointer"
            onClick={handleClick}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 z-10" />
            <img
                src={PeopleImage}
                alt="Article background"
                className="w-full h-full object-cover transition-transform duration-700"
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white z-20">
                <div className="space-y-4 w-[80%]">
                    {/* Category Tag */}
                    <h2 className="text-xl md:text-2xl font-bold leading-tight tracking-tight">
                        {category || '통신/뉴미디어'}
                    </h2>

                    {/* Title */}
                    <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                        {title || '[MWC] LGU+ \'AI 에이전트 익시오\' 중동진출..."현지 최대통신사와 협력"'}
                    </h2>

                    {/* Content Preview */}
                    <p className="text-base md:text-lg opacity-90 leading-relaxed max-w-3xl">
                        {content || '자회사그룹과 MWC 2025사업 업무협약...사우디에 연내 및 출시 목표'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MainArticle;
