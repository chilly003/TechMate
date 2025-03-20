import React from 'react';
import { useNavigate } from 'react-router-dom';
import IntroImage from '../assets/images/IntroImage.jpg';
import SocialLoginButton from '../components/ui/SocialLoginButton';

const Intro = () => {
    const navigate = useNavigate();

    const handleSocialLogin = (provider) => {
        // Handle login logic here
        console.log(`${provider} login clicked`);
    };

    return (
        <div className="flex flex-row min-h-screen h-screen w-full">
            {/* Left section - hidden on mobile */}
            <div className="hidden md:block md:w-1/2 relative">
                <img
                    src={IntroImage}
                    alt="Tech city skyline"
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.8) saturate(1.2)' }}
                />
            </div>

            {/* Right section - full width on mobile, 33% on desktop */}
            {/* Right section */}
            <div className="w-full md:w-1/2 bg-white flex items-center justify-center text-black p-8">
                <div className="w-[60%] md:w-[50%] flex flex-col items-center justify-center">
                    <div className="w-full text-center space-y-6">
                        <div className="space-y-2 flex flex-col items-center">
                            <h1 className="text-h1 md:text-4xl font-bold flex justify-center">
                                <span className="text-primary-500">Tech</span>
                                <span className="text-black">Mate</span>
                            </h1>
                            <div className="w-12 md:w-36 h-1 bg-primary-500 mx-auto rounded-full"></div>
                        </div>
                        <div className="space-y-1 flex flex-col items-center w-full">
                            <div className="w-full">
                                <p className="text-base md:text-h5 text-black font-medium text-left">반갑습니다.</p>
                                <p className="text-body-sm md:text-h5 text-black text-left">당신의 기술메이트 테크메이트</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full space-y-4 mt-12">
                        <SocialLoginButton
                            provider="kakao"
                            onClick={() => handleSocialLogin('kakao')}
                        />
                        <SocialLoginButton
                            provider="google"
                            onClick={() => handleSocialLogin('google')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Intro;
