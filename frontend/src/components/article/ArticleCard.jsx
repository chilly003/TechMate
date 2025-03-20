import React from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyImage from '../../assets/images/company.png';
import ListImage from '../../assets/images/list1.jpg';

const ArticleCard = ({ imageUrl, title, publisher, id }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/article/${id}`);
    };

    return (
        <div
            className="flex flex-col cursor-pointer transition-colors p-2"
            onClick={handleClick}
        >
            {/* Article Image */}
            <div className="w-full aspect-[3/4] mb-3 overflow-hidden relative">
                <img
                    src={ListImage}
                    alt="Article thumbnail"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 hover:rotate-3"
                />
                <div className="absolute bottom-3 left-3">
                    <span className="text-white font-extrabold px-1 md:px-3 py-1 rounded-full text-sm md:text-h5">
                        {publisher || "IT/일반"}
                    </span>
                </div>
            </div>

            {/* Article Content */}
            <div className="flex flex-col">
                <div className="font-extrabold text-base md:text-h4 mb-2 mr-none md:mr-2 line-clamp-2 md:line-clamp-none">
                    {title || "김영진 KT 대표 \"호텔 부문선, 본업 아냐...매각해 통신·AI 투자\"[MWC25]"}
                </div>

                <h3 className="text-base md:text-base line-clamp-1 mb-2 mr-none md:mr-5">
                    {title || "김영진 KT 대표 \"호텔 부문선, 본업 아냐...매각해 통신·AI 투자\"[MWC25]"}
                </h3>
                <div className="flex justify-between items-end mt-2">
                    <div className="text-gray-500 text-sm">
                        2025.06.12
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <img
                            src={CompanyImage}
                            alt="author"
                            className="w-6 h-6 md:w-12 md:h-12 rounded-full object-cover"
                        />
                        <span className="text-xs md:text-sm">매일경제</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
