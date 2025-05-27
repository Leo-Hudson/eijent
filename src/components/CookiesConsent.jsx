import React from 'react'

export const CookiesConsent = ({ data }) => {
    const { cookiesPopupText, cookiesPopupButtonLabel } = data;

    return (
        <div className="container-cookies d-none" data-aos="fadeIn - 1s" data-cursor-style="default">
            <div className="utilizamos-cookies">
                <p className="text-cookies">{cookiesPopupText}</p>
                <div className="container-btn">
                    <button className="btn-cookies accept fs--12" data-close-cookies>
                        <span>{cookiesPopupButtonLabel}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
