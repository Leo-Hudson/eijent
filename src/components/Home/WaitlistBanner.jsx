import React from 'react'

export const WaitlistBanner = () => {
    return (
        <section className="section-waitlist">
            <div className="container-fluid pos-relative z-5" data-parallax data-parallax-no-mobile
                data-trigger="parent" 
                data-translate-y-from="-20%" 
                // data-translate-y-from="0"
                data-end="bottom bottom">
                <div className="row">
                    <div className="col-lg-8 offset-lg-2 column-1 white-1">
                        <div className="container-text">
                            <h3 className="fs--30 fs-mobile-18">Don’t miss out!</h3>
                            <h2 className="fs--80 lh-100 text-center mt-lg-15">
                                <span className="d-block">Your sales power-up is here.</span>
                                <span className="d-block">Be among the first.</span>
                            </h2>
                        </div>
                        <div className="container-btn no-mobile">
                            <button data-scrollto="#footer" className="btn-1">
                                <span>Join the Waitlist Now</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-img bg-media">
                <video data-src="images/lib/video.mp4#t=0.01" src="images/lib/video.mp4#t=0.01" className=" media "
                    muted data-autoplay loop playsInline></video>
            </div>
        </section>
    )
}
