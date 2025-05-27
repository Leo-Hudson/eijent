"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import React from "react";

export const CustomScripts = () => {
  const pathname = usePathname();
  const baseUrl = process.env.BASE_URL;
  const canonicalUrl = `${baseUrl}${pathname}`;

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      <Script type="module" src="https://cdnjs.cloudflare.com/ajax/libs/plyr/3.7.8/plyr.min.js" crossOrigin="anonymous" />
      <Script type="module" src="/assets/app2.js" crossOrigin="anonymous" />
      <Script type="module" src="/assets/loader.js" crossOrigin="anonymous" />
    </>
  );
};