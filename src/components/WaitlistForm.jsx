import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { joinWaitList } from '@/services';
import { logError } from '@/utils';

const schema = yup.object({
    company: yup.string().required('Company is required'),
    role: yup.string().required('Role is required'),
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    email: yup.string().email('Email is invalid').required('Email is required'),
}).required();

export const WaitlistForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            const response = await joinWaitList(data);
            console.log("response", response);

            toast.success('Successfully added to waitlist!');
            setTimeout(() => {
                reset();
                setIsSubmitting(false);
            }, 2e2);
        } catch (error) {
            logError("Error:", error);
            toast.error('Failed to join waitlist. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Join Our Waitlist</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Company:</label>
                    <input
                        type="text"
                        disabled={isSubmitting}
                        placeholder="Your company"
                        {...register("company")}
                    />
                    {errors.company && <span className="error">{errors.company.message}</span>}
                </div>

                <div className="form-group">
                    <label>Role:</label>
                    <input
                        type="text"
                        disabled={isSubmitting}
                        placeholder="Your role"
                        {...register("role")}
                    />
                    {errors.role && <span className="error">{errors.role.message}</span>}
                </div>

                <div className="name-fields">
                    <div className="form-group">
                        <label>First Name:</label>
                        <input
                            type="text"
                            disabled={isSubmitting}
                            placeholder="First name"
                            {...register("first_name")}
                        />
                        {errors.first_name && <span className="error">{errors.first_name.message}</span>}
                    </div>

                    <div className="form-group">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            disabled={isSubmitting}
                            placeholder="Last name"
                            {...register("last_name")}
                        />
                        {errors.last_name && <span className="error">{errors.last_name.message}</span>}
                    </div>
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        disabled={isSubmitting}
                        placeholder="your.email@example.com"
                        {...register("email")}
                    />
                    {errors.email && <span className="error">{errors.email.message}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
                </button>
            </form>

            <style jsx>{`
                .form-container {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    border: 1px solid #eaeaea;
                }
                
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #333;
                }
                
                .form-group {
                    margin-bottom: 15px;
                }
                
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-size: 0.9rem;
                    font-weight: 500;
                }
                
                input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 1rem;
                }
                
                input:focus {
                    outline: none;
                    border-color: #4a90e2;
                    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
                }
                
                input:disabled {
                    background-color: #f5f5f5;
                    cursor: not-allowed;
                }
                
                .error {
                    color: #e53e3e;
                    font-size: 0.8rem;
                    margin-top: 5px;
                    display: block;
                }
                
                button {
                    width: 100%;
                    padding: 12px;
                    background-color: #4a90e2;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    margin-top: 10px;
                    transition: background-color 0.2s;
                }
                
                button:hover:not(:disabled) {
                    background-color: #3a7bc8;
                }
                
                button:disabled {
                    background-color: #a0c0e8;
                    cursor: not-allowed;
                }
                
                .name-fields {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }
                
                @media (max-width: 600px) {
                    .name-fields {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};