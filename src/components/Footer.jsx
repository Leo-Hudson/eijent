"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { logError } from '@/utils';
import { resetFormAnimations, updatedWatched } from '@/utils/AnimationsHandler';
import { joinWaitList } from '@/services/submissions';

const schema = yup.object({
    company: yup.string().required('Company is required'),
    role: yup.string().required('Role is required'),
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    email: yup.string().email('E-mail is invalid').required('E-mail is required'),
}).required();

export const Footer = ({ data }) => {
    const { copyright, emailPlaceholder, poweredBy, companyPlaceholder, rolePlaceholder, firstNamePlaceholder, buttonLabel, title, lastNamePlaceholder } = data;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formState, setFormState] = useState();
    const [feedbackMessage, SetFeedbackMessage] = useState();

    const {
        register,
        handleSubmit,
        reset,
    } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await joinWaitList(data);
            setFormState("success");
            SetFeedbackMessage("Your request has been submitted successfully.");
            updatedWatched();
            setTimeout(() => {
                reset();
                resetStates(true);
            }, 2e3);
        } catch (error) {
            logError(error);
            SetFeedbackMessage(error.message);
            setFormState("error");
            updatedWatched();
            setTimeout(() => {
                resetStates();
            }, 2e3);
        }
    };

    const resetStates = (resetAnimation = false) => {
        setIsSubmitting(false);
        setFormState(null);
        SetFeedbackMessage(null);
        updatedWatched();

        if (resetAnimation) {
            setTimeout(() => {
                resetFormAnimations();
            }, 500);
        }
    }

    return (
        <footer id="footer" className='footer-custom'>
            <div className="container-fluid">
                <div className="row row-1">
                    <div className="col-lg-6 col-landscape-8 column-1 mx-auto">
                        <h2 className="fs--60 fs-mobile-36 white-1 text-center">{title}</h2>
                        <div className="container-sign-up" data-form-state={formState}>
                            <form onSubmit={handleSubmit(onSubmit)} className="form-sign-up" >
                                <div className="container-input col-lg-6">
                                    <label htmlFor="sign-up-company">{companyPlaceholder}</label>
                                    <input
                                        id="sign-up-company"
                                        type="text"
                                        disabled={isSubmitting}
                                        {...register("company")}
                                    />
                                </div>
                                <div className="container-input col-lg-6">
                                    <label htmlFor="sign-up-role">{rolePlaceholder}</label>
                                    <input
                                        id="sign-up-role"
                                        type="text"
                                        disabled={isSubmitting}
                                        {...register("role")}
                                    />
                                </div>
                                <div className="container-input col-lg-6">
                                    <label htmlFor="sign-up-first-name">{firstNamePlaceholder}</label>
                                    <input
                                        id="sign-up-first-name"
                                        type="text"
                                        disabled={isSubmitting}
                                        {...register("first_name")}
                                    />
                                </div>
                                <div className="container-input col-lg-6">
                                    <label htmlFor="sign-up-last-name">{lastNamePlaceholder}</label>
                                    <input
                                        id="sign-up-last-name"
                                        type="text"
                                        disabled={isSubmitting}
                                        {...register("last_name")}
                                    />
                                </div>
                                <div className="container-input col-lg-6">
                                    <label htmlFor="sign-up-email">{emailPlaceholder}</label>
                                    <input
                                        id="sign-up-email"
                                        type="email"
                                        disabled={isSubmitting}
                                        {...register("email")}
                                    />
                                </div>
                                <div className="container-submit col-lg-6">
                                    <button type="submit" className="bt-submit" disabled={isSubmitting}>
                                        <span className="submit-text">{buttonLabel}</span>
                                    </button>
                                </div>
                            </form>
                            {feedbackMessage && (<h3 className="feedback-sign-up" data-aos="fadeIn">{feedbackMessage}</h3>)}
                        </div>
                    </div>
                </div>
                <div className="row row-2">
                    <div className="col-lg-12 column-1">
                        <a href="" className="link-blueprint">
                            <span>{poweredBy}</span>
                            <i className="icon-logo-blueprint"></i>
                        </a>
                        <p className="fs--12 white-1">{copyright}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};