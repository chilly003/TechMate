import React from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyImage from '../../assets/images/company.png';
import ArticleCardImage from '../../assets/images/ArticleCardImage.jpg';

const ArticleCard = ({ id, imageUrl, category, title, content, date }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/article/${id}`);
    };

    return (
        <div
            className="flex flex-row sm:flex-col cursor-pointer transition-colors p-2 gap-3 sm:gap-0"
            onClick={handleClick}
        >
            {/* Article Image */}
            <div className="w-1/3 sm:w-full aspect-[3/4] sm:mb-3 overflow-hidden relative flex-shrink-0">
                <img
                    src={imageUrl || ArticleCardImage}
                    alt="Article thumbnail"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 hover:rotate-3"
                />
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                    <span className="text-white font-extrabold px-1 sm:px-3 py-1 rounded-full text-xs sm:text-h5">
                        {category || "IT/일반"}
                    </span>
                </div>
            </div>

            {/* Article Content */}
            <div className="flex flex-col flex-grow justify-between">
                <div>
                    <div className="font-extrabold text-h4 sm:text-h4 mb-1 sm:mb-2 mr-none sm:mr-2 line-clamp-3">
                        {title || "김영진 KT 대표 \"호텔 부문선, 본업 아냐...매각해 통신·AI 투자\"[MWC25]"}
                    </div>

                    <h3 className="hidden sm:block text-base line-clamp-1 mb-2 mr-none sm:mr-5">
                        {content || "김영진 KT 대표 \"호텔 부문선, 본업 아냐...매각해 통신·AI 투자\"[MWC25]"}
                    </h3>
                </div>

                <div className="flex justify-between items-end mt-auto">
                    <div className="text-black text-sm sm:text-sm">
                        {date || "2025.06.12"}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <img
                            src={CompanyImage}
                            alt="author"
                            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full object-cover"
                        />
                        <span className="text-sm sm:text-sm">매일경제</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
