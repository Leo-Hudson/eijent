"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const TransitionWrapper = ({ children }) => {
    const pathname = usePathname();
    const path = pathname.trim() === "/" ? "home" : pathname.substring(1);
    let cleanPath = path.split("/")[0].trim();

    useEffect(() => {
        if (typeof window !== "undefined") {
            document.body.dataset.pg = `pg-${cleanPath}`;
        }
    }, [pathname]);
    return (
        <div id="main-transition">
            <div className="wrapper" id={`pg-${cleanPath}`} data-scroll-container>
                {children}
            </div>
        </div>
    );
};