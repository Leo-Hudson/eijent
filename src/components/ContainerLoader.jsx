"use client";
import { loadContainer } from '@/utils/AnimationsHandler';
import { useEffect } from 'react'

export const ContainerLoader = ({ log }) => {
    useEffect(() => {
        if(log) console.log("data", log);
        setTimeout(() => {
            loadContainer();
        }, 500);
    }, []);
    return;
}
