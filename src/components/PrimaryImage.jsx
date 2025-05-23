"use client"
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import Image from 'next/image';
import { generateImageURL, generateImageURLAlternate, generateSVGURL } from "@/utils/generateImageURL";


export const PrimaryImage = ({
    url,
    type = "default",
    original,
    fit = "fill",
    q = "90",
    min_w,
    min_h,
    customClasses = "",
    alt = "",
    attributes,
    defaultDimensions,
    timeout = 100,
    useNextImage = false
}) => {

    if (!url) return null;

    const ref = useRef();
    const [src, setSrc] = useState();
    const [height, setHeight] = useState();
    const [width, setWidth] = useState();

    const generateSrc = () => {
        if (original) return generateImageURL({ wix_url: url, original });

        if (ref.current) {
            const newWidth = ref.current.clientWidth;
            const newHeight = ref.current.clientHeight;
            let width = min_w && min_w > newWidth ? min_w : newWidth;
            let height = min_h && min_h > newHeight ? min_h : newHeight;

            if (!width && defaultDimensions) width = defaultDimensions.width;
            if (!height && defaultDimensions) height = defaultDimensions.height;
            setHeight(height);
            setWidth(width);
            switch (type) {
                case "default":
                    return generateImageURL({ wix_url: url, w: width, h: height, original, fit, q });
                case "alternate":
                    return generateImageURLAlternate({ wix_url: url, w: width, h: height, original, fit, q });
                case "svg":
                    return generateSVGURL(url);
                case "product":
                    return `${url}/v1/${fit}/w_${width},h_${height},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
                case "insta":
                    return `https://static.wixstatic.com/media/${url}/v1/${fit}/w_${width},h_${height},al_c,q_${q},usm_0.66_1.00_0.01,enc_auto/compress.webp`;
                default:
                    return "";
            }
        }
    };

    const handleResize = debounce(() => {
        const newSrc = generateSrc();
        setSrc(newSrc);
    }, 1000);

    useEffect(() => {
        setTimeout(() => {
            const newSrc = generateSrc();
            setSrc(newSrc);
        }, timeout);

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            {useNextImage && src && height && width ? <Image ref={ref} src={src} quality={q} loading={"eager"} height={height} width={width} className={customClasses} {...attributes} alt={alt} /> :
                <img
                    ref={ref}
                    src={src}
                    className={customClasses}
                    alt={alt}
                    {...attributes}
                />
            }
        </>
    );
};