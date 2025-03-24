import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 pointer-events-none transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'
                }`}
        >
            <div className="max-w-[2000px] mx-auto px-8 md:px-12 h-24 flex items-center">
                <Link to="/Home" className="inline-flex items-center pointer-events-auto">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                        TechMate
                    </h1>
                </Link>
            </div>
        </header>
    );
};

export default Header;