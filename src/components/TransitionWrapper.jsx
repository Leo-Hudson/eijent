"use client";
import { usePathname } from "next/navigation";

export const TransitionWrapper = ({ children }) => {
    const pathname = usePathname();
    const path = pathname.trim() === "/" ? "home" : pathname.substring(1);
    let cleanPath = path.split("/")[0].trim();

    return (
        <div id="main-transition">
            <div className="wrapper" data-scroll-container>
                {children}
            </div>
        </div>
    );
};