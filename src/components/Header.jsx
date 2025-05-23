import React from 'react'

export const Header = () => {
    return (
        <header id="header">
            <div className="header-menu">
                <div className="wrapper-logo">
                    <button className="logo" data-pjax aria-label="Eijent" data-scrollto="0" data-duration="1.4">
                        <span className="hide">Eijent</span>
                        <div className="container-img">
                            <img src="images/logo.svg" className="media  " />
                        </div>
                    </button>
                </div>
                <button className="btn-join-waitlist" data-scrollto="#footer" data-duration="1.4">
                    <span>Join the Waitlist Now</span>
                </button>
            </div>
        </header>
    )
}
