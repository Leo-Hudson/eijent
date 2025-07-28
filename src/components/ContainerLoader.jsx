"use client";
import { loadContainer } from '@/utils/AnimationsHandler';
import { useEffect } from 'react'

export const ContainerLoader = ({ log }) => {
    useEffect(() => {
        setTimeout(() => {
            loadContainer();
        }, 500);
    }, []);
    return;
}
