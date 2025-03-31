import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainArticleImage from '../../assets/images/MainArticleImage.jpg';

const MainArticle = ({ id, imageUrl, category, title, journal, summary }) => {
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
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${imageUrl || MainArticleImage})`
                }}
            />

            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 text-white z-20">
                <div className="space-y-4 w-[80%]">
                    <h2 className="text-xl md:text-2xl font-bold leading-tight tracking-tight">
                        {category}
                    </h2>

                    <h2 className="text-3xl md:text-h3 font-bold leading-tight tracking-tight">
                        {title}
                    </h2>

                    <p className="text-base md:text-lg opacity-90 leading-relaxed max-w-3xl">
                        {summary}
                    </p>

                    <p className="text-sm opacity-75">
                        {journal}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MainArticle;
