import React from 'react'

export const Features = () => {
    return (
        <section className="section-features">
            <div className="container-fluid" data-parallax data-trigger="parent" data-translate-y-from="20rem"
                data-start="bottom bottom" data-end="bottom top">
                <div className="bg-blue" data-parallax data-trigger="parent" data-translate-y="-30rem"
                    data-tablet-translate-y="-13rem" data-phone-translate-y="-10rem" data-end="bottom bottom">
                    <div className="green-gradient" data-parallax data-translate-y="100vh"
                        data-tablet-translate-y="30vh" data-phone-translate-y="10vh"></div>
                    <div className="purple-gradient" data-parallax data-translate-y="130vh"
                        data-tablet-translate-y="-40vh" data-phone-translate-y="-20vh"></div>
                </div>
                <div className="row">
                    <div className="col-12 pos-relative">
                        <h2 className="fs--80 text-center mb-lg-70 mb-tablet-70 mb-phone-40 white-1">
                            <span className="d-block"><span className="fw-300">Made for</span> today.</span>
                            <span className="d-block">Ready for what comes next.</span>
                        </h2>
                        <ul className="list-features">
                            <li className="list-item list-item-1">
                                <div className="container-feature">
                                    <div className="container-img">
                                        <img src="images/features-01.png" className="media  " />
                                    </div>
                                    <h3 className="feature-title">AI-First Architecture</h3>
                                    <p className="feature-description">
                                        AI is not just a buzzword here. Eijent is built AI-first to deliver a
                                        seamless intuitive
                                        experience - Every feature is designed to make you more efficient, from
                                        automated task
                                        management to proactive recommendations.
                                    </p>
                                </div>
                            </li>
                            <li className="list-item list-item-2">
                                <div className="container-feature">
                                    <div className="container-img">
                                        <img src="images/features-02.png" className="media  " />
                                    </div>
                                    <h3 className="feature-title">Proactive Smart Digital Twin</h3>
                                    <p className="feature-description">
                                        Think of Eijent as your second brain for sales and marketing. It
                                        anticipates next steps,
                                        and suggests actions to keep deals moving forward.
                                    </p>
                                </div>
                            </li>
                            <li className="list-item list-item-3">
                                <div className="container-feature">
                                    <div className="container-img">
                                        <img src="images/features-01.png" className="media  " />
                                    </div>
                                    <h3 className="feature-title">Personalized Sales Strategies</h3>
                                    <p className="feature-description">
                                        No more one-size-fits-all approaches. Eijent adapts to your unique
                                        workflow, providing
                                        smart insights to optimize every interaction and close more deals.
                                    </p>
                                </div>
                            </li>
                            <li className="list-item list-item-4">
                                <div className="container-feature">
                                    <div className="container-img">
                                        <img src="images/features-02.png" className="media  " />
                                    </div>
                                    <h3 className="feature-title">Accelerated Lead Generation</h3>
                                    <p className="feature-description">
                                        Eijent helps you identify high-value leads with AI-lead insights so you
                                        never miss a
                                        conversion opportunity.
                                    </p>
                                </div>
                            </li>
                            <li className="list-item list-item-5">
                                <div className="container-feature">
                                    <div className="container-img">
                                        <img src="images/features-01.png" className="media  " />
                                    </div>
                                    <h3 className="feature-title">Dynamic Sales Pipelines</h3>
                                    <p className="feature-description">
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
