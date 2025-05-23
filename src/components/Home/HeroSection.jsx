import React from 'react'

export const HeroSection = () => {
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
                                data-trigger=".section-features .container-fluid" data-translate-y="-50rem"
                                data-end="bottom bottom">
                                <video data-src="images/logo-animacao.mp4#t=0.01"
                                    src="images/logo-animacao.mp4#t=0.01" className=" media " muted data-autoplay
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
                                <h1 className="fs--80 text-center">The AI-Powered Sidekick for Every Sales &
                                    Marketing Team</h1>
                                <p className="fs--21 text-center">
                                    Stop juggling tools. Eijent unifies all your sales and marketing efforts
                                    with cutting-edge AI,
                                    keeping you one step ahead so you can sell smarter, move faster, and focus
                                    on what really
                                    matters.
                                </p>
                                <button data-scrollto="#footer" className="btn-1">
                                    <span>Join the Waitlist Now</span>
                                </button>
                            </div>
                            <div className="wrapper-img">
                                <div className="content-img container-video-player no-mobile">
                                    <button className="btn-open-video">
                                        <div className="blur-mask"></div>
                                        <div className="chat-message">
                                            <i className="icon-close"></i>
                                            <div className="content-text">
                                                <i className="icon-star"></i>
                                                <div className="container-text">
                                                    <div className="message-title">
                                                        <h3>We are losing sales</h3>
                                                    </div>
                                                    <p>
                                                        We are getting a lot of leads from New York but
                                                        conversion is low
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="btn-view">
                                                <span>View</span>
                                            </div>
                                        </div>
                                        <div className="play">
                                            <i className="icon-play"></i>
                                        </div>
                                        <div className="container-img">
                                            <img src="images/presentation-img-01.png" className="media  " />
                                        </div>
                                    </button>
                                    <button className="btn-close-video">
                                        <i className="icon-close"></i>
                                    </button>
                                    <div className="wrapper-plyr">
                                        <div className="container-video container-plyr">
                                            <div className="video-player">
                                                <iframe
                                                    src="https://player.vimeo.com/video/909269180?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                                                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                                                    title="Blueprint Studios - Formula One Las Vegas Grand Prix Unveiled"></iframe>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <btn-modal-open group="modal-video" className="content-img no-desktop">
                                    <div className="blur-mask"></div>
                                    <div className="chat-message">
                                        <i className="icon-close"></i>
                                        <div className="content-text">
                                            <i className="icon-star"></i>
                                            <div className="container-text">
                                                <div className="message-title">
                                                    <h3>We are losing sales</h3>
                                                </div>
                                                <p>
                                                    We are getting a lot of leads from New York but conversion
                                                    is low
                                                </p>
                                            </div>
                                        </div>
                                        <div className="btn-view">
                                            <span>View</span>
                                        </div>
                                    </div>
                                    <div className="play">
                                        <i className="icon-play"></i>
                                    </div>
                                    <div className="container-img">
                                        <img src="images/presentation-img-01.png" className="media  " />
                                    </div>
                                </btn-modal-open>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white">
                        <div className="bg"></div>
                    </div>
                </div>
                <div className="container-fluid container-2">
                    <div className="row">
                        <div className="col-12 column-1">
                            <div className="wrapper-column-sticky">
                                <h3 className="fs--28 black-1 text-center" data-parallax
                                    data-trigger=".section-features .container-fluid" data-translate-y="-50rem"
                                    data-tablet-translate-y="-30rem" data-phone-translate-y="-20rem"
                                    data-end="bottom bottom">
                                    <span className="d-block">Hi, I’m <span className="fw-600">Eijent</span></span>
                                    <span className="d-block mt-tablet-5">your AI-powered sidekick for sales</span>
                                </h3>
                                <div className="wrapper-lines" data-parallax
                                    data-trigger=".section-features .container-fluid" data-translate-y="-50rem"
                                    data-tablet-translate-y="-30rem" data-phone-translate-y="-20rem"
                                    data-end="bottom bottom">
                                    <div className="container-line container-line-1">
                                        <div className="line">
                                            <span className="text">I handle the busywork. You close deals 🔥</span>
                                        </div>
                                    </div>
                                    <div className="container-line container-line-2">
                                        <div className="line">
                                            <span className="text">I make sure nothing slips through 🎯</span>
                                        </div>
                                    </div>
                                    <div className="container-line container-line-3">
                                        <div className="line">
                                            <span className="text">I keep your brand sharp and consistent 🗣️</span>
                                        </div>
                                    </div>
                                    <div className="container-line container-line-4">
                                        <div className="line">
                                            <span className="text">🧠 Deep, intuitive, for everyone</span>
                                        </div>
                                    </div>
                                    <div className="container-line container-line-5">
                                        <div className="line">
                                            <span className="text">Your next move? I got you ♟️</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
