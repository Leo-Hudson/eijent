import React from 'react'
import { PrimaryImage } from './PrimaryImage';

export const Header = ({ data }) => {

    const { sitename, ctaLabel, logo } = data;
    return (
        <header id="header">
            <div className="header-menu">
                <div className="wrapper-logo">
                    <button className="logo" data-pjax aria-label="Eijent" data-scrollto="0" data-duration="1.4">
                        <span className="hide">{sitename}</span>
                        <div className="container-img">
                            <PrimaryImage url={logo} type={"svg"} customClasses={"media"} />
                        </div>
                    </button>
                </div>
                {/* <button className="btn-join-waitlist" data-scrollto="#footer" data-duration="1.4">
                    <span>{ctaLabel}</span>
                </button> */}
            </div>
        </header>
    )
}
