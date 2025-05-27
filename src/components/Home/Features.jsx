import React from 'react';
import parse from 'html-react-parser';
import { PrimaryImage } from '../PrimaryImage';

export const Features = ({ data, pageData }) => {
    const { featuresSectionTitle } = pageData;
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
                        <h2 className="fw-300 strong-fw-600 fs--80 text-center mb-lg-70 mb-tablet-70 mb-phone-40 white-1">
                            {parse(featuresSectionTitle)}
                        </h2>
                        <ul className="list-features">
                            {data.map((feature, index) => {
                                const { title, description, icon } = feature;
                                return (
                                    <li key={index} className={`list-item list-item-${index + 1}`}>
                                        <div className="container-feature">
                                            <div className="container-img">
                                                <PrimaryImage url={icon} customClasses={"media"} />
                                            </div>
                                            <h3 className="feature-title">{title}</h3>
                                            <p className="feature-description">{description}</p>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
