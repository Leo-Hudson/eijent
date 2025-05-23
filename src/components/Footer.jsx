import React from 'react'

export const Footer = () => {
    return (
        <footer id="footer">
            <div class="container-fluid">
                <div class="row row-1">
                    <div class="col-lg-6 col-landscape-8 column-1 mx-auto">
                        <h2 class="fs--60 fs-mobile-36 white-1 text-center">Sign up and get ahead</h2>
                        <div class="container-sign-up" data-form-container>
                            <form class="form-sign-up">
                                <input type="hidden" name="assunto" value="[Sign Up]" />
                                    <div class="container-input col-lg-6">
                                        <label for="sign-up-company">Company</label>
                                        <input id="sign-up-company" name="company" type="text" required />
                                    </div>
                                    <div class="container-input col-lg-6">
                                        <label for="sign-up-role">Role</label>
                                        <input id="sign-up-role" name="role" type="text" required />
                                    </div>
                                    <div class="container-input col-lg-6">
                                        <label for="sign-up-first-name">First name</label>
                                        <input id="sign-up-first-name" name="first_name" type="text" required />
                                    </div>
                                    <div class="container-input col-lg-6">
                                        <label for="sign-up-last-name">Last name</label>
                                        <input id="sign-up-last-name" name="last_name" type="text" required />
                                    </div>
                                    <div class="container-input col-lg-6">
                                        <label for="sign-up-email">E-mail</label>
                                        <input id="sign-up-email" name="email" type="email" required />
                                    </div>
                                    <div class="container-submit col-lg-6">
                                        <button type="submit" class="bt-submit">
                                            <span class="submit-text">Send</span>
                                        </button>
                                    </div>
                            </form>
                            <h3 class="feedback-sign-up d-none" data-aos="fadeIn"></h3>
                        </div>
                        <ul class="list-social-media">
                            <li>
                                <a href="#" class="link-social-media" target="_blank" rel="noopener noreferrer">
                                    <i class="icon-facebook"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="link-social-media" target="_blank" rel="noopener noreferrer">
                                    <i class="icon-instagram"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="link-social-media" target="_blank" rel="noopener noreferrer">
                                    <i class="icon-twitter"></i>
                                </a>
                            </li>
                            <li>
                                <a href="#" class="link-social-media" target="_blank" rel="noopener noreferrer">
                                    <i class="icon-linkedin"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row row-2">
                    <div class="col-lg-12 column-1">
                        <a href="" class="link-blueprint">
                            <span>Powered by</span>
                            <i class="icon-logo-blueprint"></i>
                        </a>
                        <p class="fs--12 white-1">
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
