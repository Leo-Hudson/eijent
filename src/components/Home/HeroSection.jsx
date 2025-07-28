"use client";
import React from 'react';
import { generateVideoURL } from '@/utils/generateImageURL';
import { useMobile } from '@/hooks/useDevice';

export const HeroSection = ({ data = {}, pageData = {} }) => {
    const { headline } = data;
    const { logoAnimation } = pageData;
    const logoURL = generateVideoURL(logoAnimation);
    const isMobile = useMobile();

    return (
        <div className="wrapper-sticky">
            <div className="gradient-spacer">
                <section className="section-intro" data-sticky data-trigger="parent" data-spacer="parent">
                    <div className="green-gradient" data-parallax-top data-translate-y="-100vh"
                        data-phone-translate-y="100vh">
                    </div>
                    <div className="purple-gradient" data-parallax-top data-translate-y="80vh"></div>
                </section>
            </div>
            <div className="animation-spacer">
                <div className="wrapper-animation" data-sticky data-trigger="parent" data-spacer="parent">
                    <div className="animation-placeholder-center">
                        <div className="animation-wrapper-logo">
                            <div className="container-img logo-img" data-parallax
                                data-trigger=".section-features .container-fluid" data-translate-y={isMobile ? "6rem" : "-2rem"}
                                data-end="bottom bottom" data-scale=".6">
                                <video data-src={logoURL}
                                    src={logoURL} className=" media " muted data-autoplay
                                    loop playsInline></video>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="section-presentation">
                <div className="container-fluid container-1">
                    <div className="row">
                        <div className="col-md-8 col-landscape-10 offset-md-2 offset-landscape-1 column-1 white-1">
                            <div className="wrapper-text">
                                <h1 className="fs--80 text-center">{headline}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
