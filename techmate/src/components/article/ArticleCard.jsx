import React from 'react';
import { useNavigate } from 'react-router-dom';
import IntroImage from '../../assets/images/IntroImage.jpg';

const ArticleCard = ({ imageUrl, title, publisher, id }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/article/${id}`);
    };

    return (
        <div 
            className="flex flex-col hover:bg-gray-50 cursor-pointer transition-colors p-4"
            onClick={handleClick}
        >
            {/* Article Image */}
            <div className="w-full aspect-[3/4] mb-3 overflow-hidden">
                <img 
                    src={IntroImage}
                    alt="Article thumbnail"
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-110 hover:rotate-3"
                />
            </div>

            {/* Article Content */}
            <div className="flex flex-col">
                <h3 className="font-bold text-base line-clamp-2 mb-2">
                    {title || "김영진 KT 대표 \"호텔 부문선, 본업 아냐...매각해 통신·AI 투자\"[MWC25]"}
                </h3>
                <p className="text-gray-500 text-sm">
                    {publisher || "기업/경제"}
                </p>
            </div>
        </div>
    );
};

export default ArticleCard;
