import React from 'react'

export const WaitlistBanner = () => {
    return (
        <section class="section-waitlist">
            <div class="container-fluid pos-relative z-5" data-parallax data-parallax-no-mobile
                data-trigger="parent" 
                data-translate-y-from="-20%" 
                // data-translate-y-from="0"
                data-end="bottom bottom">
                <div class="row">
                    <div class="col-lg-8 offset-lg-2 column-1 white-1">
                        <div class="container-text">
                            <h3 class="fs--30 fs-mobile-18">Don’t miss out!</h3>
                            <h2 class="fs--80 lh-100 text-center mt-lg-15">
                                <span class="d-block">Your sales power-up is here.</span>
                                <span class="d-block">Be among the first.</span>
                            </h2>
                        </div>
                        <div class="container-btn no-mobile">
                            <button data-scrollto="#footer" class="btn-1">
                                <span>Join the Waitlist Now</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-img bg-media">
                <video data-src="images/lib/video.mp4#t=0.01" src="images/lib/video.mp4#t=0.01" class=" media "
                    muted data-autoplay loop playsinline></video>
            </div>
        </section>
    )
}
