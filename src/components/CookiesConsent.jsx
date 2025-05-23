import React from 'react'

export const CookiesConsent = () => {
    return (
        <div className="container-cookies d-none" data-aos="fadeIn - 1s" data-cursor-style="default">
            <div className="utilizamos-cookies">
                <p className="text-cookies">
                    This website uses cookies to provide necessary website functionality, improve your experience and
                    analyze
                    our traffic.
                </p>
                <div className="container-btn">
                    <button className="btn-cookies accept fs--12" data-close-cookies>
                        <span>OK</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
