import React from 'react'

export const HeroSection = () => {
    return (
        <div class="wrapper-sticky">
            <div class="gradient-spacer">
                <section class="section-intro" data-sticky data-trigger="parent" data-spacer="parent">
                    <div class="green-gradient" data-parallax-top data-translate-y="-100vh"
                        data-phone-translate-y="100vh">
                    </div>
                    <div class="purple-gradient" data-parallax-top data-translate-y="80vh"></div>
                </section>
            </div>
            <div class="animation-spacer">
                <div class="wrapper-animation" data-sticky data-trigger="parent" data-spacer="parent">
                    <div class="animation-placeholder-center">
                        <div class="animation-wrapper-logo">
                            <div class="container-img logo-img" data-parallax
                                data-trigger=".section-features .container-fluid" data-translate-y="-50rem"
                                data-end="bottom bottom">
                                <video data-src="images/logo-animacao.mp4#t=0.01"
                                    src="images/logo-animacao.mp4#t=0.01" class=" media " muted data-autoplay
                                    loop playsinline></video>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section class="section-presentation">
                <div class="container-fluid container-1">
                    <div class="row">
                        <div class="col-md-8 col-landscape-10 offset-md-2 offset-landscape-1 column-1 white-1">
                            <div class="wrapper-text">
                                <h1 class="fs--80 text-center">The AI-Powered Sidekick for Every Sales &
                                    Marketing Team</h1>
                                <p class="fs--21 text-center">
                                    Stop juggling tools. Eijent unifies all your sales and marketing efforts
                                    with cutting-edge AI,
                                    keeping you one step ahead so you can sell smarter, move faster, and focus
                                    on what really
                                    matters.
                                </p>
                                <button data-scrollto="#footer" class="btn-1">
                                    <span>Join the Waitlist Now</span>
                                </button>
                            </div>
                            <div class="wrapper-img">
                                <div class="content-img container-video-player no-mobile">
                                    <button class="btn-open-video">
                                        <div class="blur-mask"></div>
                                        <div class="chat-message">
                                            <i class="icon-close"></i>
                                            <div class="content-text">
                                                <i class="icon-star"></i>
                                                <div class="container-text">
                                                    <div class="message-title">
                                                        <h3>We are losing sales</h3>
                                                    </div>
                                                    <p>
                                                        We are getting a lot of leads from New York but
                                                        conversion is low
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="btn-view">
                                                <span>View</span>
                                            </div>
                                        </div>
                                        <div class="play">
                                            <i class="icon-play"></i>
                                        </div>
                                        <div class="container-img">
                                            <img src="images/presentation-img-01.png" class="media  " />
                                        </div>
                                    </button>
                                    <button class="btn-close-video">
                                        <i class="icon-close"></i>
                                    </button>
                                    <div class="wrapper-plyr">
                                        <div class="container-video container-plyr">
                                            <div class="video-player">
                                                <iframe
                                                    src="https://player.vimeo.com/video/909269180?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                                                    frameborder="0"
                                                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                                                    title="Blueprint Studios - Formula One Las Vegas Grand Prix Unveiled"></iframe>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <btn-modal-open group="modal-video" class="content-img no-desktop">
                                    <div class="blur-mask"></div>
                                    <div class="chat-message">
                                        <i class="icon-close"></i>
                                        <div class="content-text">
                                            <i class="icon-star"></i>
                                            <div class="container-text">
                                                <div class="message-title">
                                                    <h3>We are losing sales</h3>
                                                </div>
                                                <p>
                                                    We are getting a lot of leads from New York but conversion
                                                    is low
                                                </p>
                                            </div>
                                        </div>
                                        <div class="btn-view">
                                            <span>View</span>
                                        </div>
                                    </div>
                                    <div class="play">
                                        <i class="icon-play"></i>
                                    </div>
                                    <div class="container-img">
                                        <img src="images/presentation-img-01.png" class="media  " />
                                    </div>
                                </btn-modal-open>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white">
                        <div class="bg"></div>
                    </div>
                </div>
                <div class="container-fluid container-2">
                    <div class="row">
                        <div class="col-12 column-1">
                            <div class="wrapper-column-sticky">
                                <h3 class="fs--28 black-1 text-center" data-parallax
                                    data-trigger=".section-features .container-fluid" data-translate-y="-50rem"
                                    data-tablet-translate-y="-30rem" data-phone-translate-y="-20rem"
                                    data-end="bottom bottom">
                                    <span class="d-block">Hi, I’m <span class="fw-600">Eijent</span></span>
                                    <span class="d-block mt-tablet-5">your AI-powered sidekick for sales</span>
                                </h3>
                                <div class="wrapper-lines" data-parallax
                                    data-trigger=".section-features .container-fluid" data-translate-y="-50rem"
                                    data-tablet-translate-y="-30rem" data-phone-translate-y="-20rem"
                                    data-end="bottom bottom">
                                    <div class="container-line container-line-1">
                                        <div class="line">
                                            <span class="text">I handle the busywork. You close deals 🔥</span>
                                        </div>
                                    </div>
                                    <div class="container-line container-line-2">
                                        <div class="line">
                                            <span class="text">I make sure nothing slips through 🎯</span>
                                        </div>
                                    </div>
                                    <div class="container-line container-line-3">
                                        <div class="line">
                                            <span class="text">I keep your brand sharp and consistent 🗣️</span>
                                        </div>
                                    </div>
                                    <div class="container-line container-line-4">
                                        <div class="line">
                                            <span class="text">🧠 Deep, intuitive, for everyone</span>
                                        </div>
                                    </div>
                                    <div class="container-line container-line-5">
                                        <div class="line">
                                            <span class="text">Your next move? I got you ♟️</span>
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
