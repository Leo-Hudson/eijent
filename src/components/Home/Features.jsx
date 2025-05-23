import React from 'react'

export const Features = () => {
    return (
        <section class="section-features">
            <div class="container-fluid" data-parallax data-trigger="parent" data-translate-y-from="20rem"
                data-start="bottom bottom" data-end="bottom top">
                <div class="bg-blue" data-parallax data-trigger="parent" data-translate-y="-30rem"
                    data-tablet-translate-y="-13rem" data-phone-translate-y="-10rem" data-end="bottom bottom">
                    <div class="green-gradient" data-parallax data-translate-y="100vh"
                        data-tablet-translate-y="30vh" data-phone-translate-y="10vh"></div>
                    <div class="purple-gradient" data-parallax data-translate-y="130vh"
                        data-tablet-translate-y="-40vh" data-phone-translate-y="-20vh"></div>
                </div>
                <div class="row">
                    <div class="col-12 pos-relative">
                        <h2 class="fs--80 text-center mb-lg-70 mb-tablet-70 mb-phone-40 white-1">
                            <span class="d-block"><span class="fw-300">Made for</span> today.</span>
                            <span class="d-block">Ready for what comes next.</span>
                        </h2>
                        <ul class="list-features">
                            <li class="list-item list-item-1">
                                <div class="container-feature">
                                    <div class="container-img">
                                        <img src="images/features-01.png" class="media  " />
                                    </div>
                                    <h3 class="feature-title">AI-First Architecture</h3>
                                    <p class="feature-description">
                                        AI is not just a buzzword here. Eijent is built AI-first to deliver a
                                        seamless intuitive
                                        experience - Every feature is designed to make you more efficient, from
                                        automated task
                                        management to proactive recommendations.
                                    </p>
                                </div>
                            </li>
                            <li class="list-item list-item-2">
                                <div class="container-feature">
                                    <div class="container-img">
                                        <img src="images/features-02.png" class="media  " />
                                    </div>
                                    <h3 class="feature-title">Proactive Smart Digital Twin</h3>
                                    <p class="feature-description">
                                        Think of Eijent as your second brain for sales and marketing. It
                                        anticipates next steps,
                                        and suggests actions to keep deals moving forward.
                                    </p>
                                </div>
                            </li>
                            <li class="list-item list-item-3">
                                <div class="container-feature">
                                    <div class="container-img">
                                        <img src="images/features-01.png" class="media  " />
                                    </div>
                                    <h3 class="feature-title">Personalized Sales Strategies</h3>
                                    <p class="feature-description">
                                        No more one-size-fits-all approaches. Eijent adapts to your unique
                                        workflow, providing
                                        smart insights to optimize every interaction and close more deals.
                                    </p>
                                </div>
                            </li>
                            <li class="list-item list-item-4">
                                <div class="container-feature">
                                    <div class="container-img">
                                        <img src="images/features-02.png" class="media  " />
                                    </div>
                                    <h3 class="feature-title">Accelerated Lead Generation</h3>
                                    <p class="feature-description">
                                        Eijent helps you identify high-value leads with AI-lead insights so you
                                        never miss a
                                        conversion opportunity.
                                    </p>
                                </div>
                            </li>
                            <li class="list-item list-item-5">
                                <div class="container-feature">
                                    <div class="container-img">
                                        <img src="images/features-01.png" class="media  " />
                                    </div>
                                    <h3 class="feature-title">Dynamic Sales Pipelines</h3>
                                    <p class="feature-description">
                                        Markets move fast—so should you. Eijent helps you adjust sales
                                        strategies in real-time
                                        based on live data and AI-powered forecasting.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
