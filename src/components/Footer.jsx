import React from 'react'

export const Footer = () => {
    return (
        <footer id="footer">
            <div className="container-fluid">
                <div className="row row-1">
                    <div className="col-lg-6 col-landscape-8 column-1 mx-auto">
                        <h2 className="fs--60 fs-mobile-36 white-1 text-center">Sign up and get ahead</h2>
                        <div className="container-sign-up" data-form-container>
                            <form className="form-sign-up">
                                <input type="hidden" name="assunto" value="[Sign Up]" />
                                    <div className="container-input col-lg-6">
                                        <label htmlFor="sign-up-company">Company</label>
                                        <input id="sign-up-company" name="company" type="text" required />
                                    </div>
                                    <div className="container-input col-lg-6">
                                        <label htmlFor="sign-up-role">Role</label>
                                        <input id="sign-up-role" name="role" type="text" required />
                                    </div>
                                    <div className="container-input col-lg-6">
                                        <label htmlFor="sign-up-first-name">First name</label>
                                        <input id="sign-up-first-name" name="first_name" type="text" required />
                                    </div>
                                    <div className="container-input col-lg-6">
                                        <label htmlFor="sign-up-last-name">Last name</label>
                                        <input id="sign-up-last-name" name="last_name" type="text" required />
                                    </div>
                                    <div className="container-input col-lg-6">
                                        <label htmlFor="sign-up-email">E-mail</label>
                                        <input id="sign-up-email" name="email" type="email" required />
                                    </div>
                                    <div className="container-submit col-lg-6">
                                        <button type="submit" className="bt-submit">
                                            <span className="submit-text">Send</span>
                                        </button>
                                    </div>
                            </form>
                            <h3 className="feedback-sign-up d-none" data-aos="fadeIn"></h3>
                        </div>
                        <ul className="list-social-media">
                            <li>
                                <a href="#" className="link-social-media" target="_blank" rel="noopener noreferrer">
                                    <i className="icon-facebook"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="link-social-media" target="_blank" rel="noopener noreferrer">
                                    <i className="icon-instagram"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="link-social-media" target="_blank" rel="noopener noreferrer">
                                    <i className="icon-twitter"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="link-social-media" target="_blank" rel="noopener noreferrer">
                                    <i className="icon-linkedin"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row row-2">
                    <div className="col-lg-12 column-1">
                        <a href="" className="link-blueprint">
                            <span>Powered by</span>
                            <i className="icon-logo-blueprint"></i>
                        </a>
                        <p className="fs--12 white-1">
                            © Eijent. ALL RIGHTS RESERVED. - If it’s not remarkable, it’s invisible is a trademark
                            of Blueprint
                            Studios.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
