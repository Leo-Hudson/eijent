import React from 'react';
import { generateVideoURL } from '@/utils/generateImageURL';

export const WaitlistBanner = ({ data }) => {
    const { ctaSectionTagline, ctaSectionTitle, ctaSectionTitle2, ctaButtonLabel, ctaBackgroundVideo } = data;
    const ctaBackgroundVideoURL = generateVideoURL(ctaBackgroundVideo);
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
                            <h3 className="fs--30 fs-mobile-18">{ctaSectionTagline}</h3>
                            <h2 className="fs--80 lh-100 text-center mt-lg-15">
                                <span className="d-block">{ctaSectionTitle}</span>
                                <span className="d-block">{ctaSectionTitle2}</span>
                            </h2>
                        </div>
                        <div className="container-btn no-mobile">
                            <button data-scrollto="#footer" className="btn-1">
                                <span>{ctaButtonLabel}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-img bg-media">
                <video data-src={ctaBackgroundVideoURL} src={ctaBackgroundVideoURL} className=" media "
                    muted data-autoplay loop playsInline></video>
            </div>
        </section>
    )
}
