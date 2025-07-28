import { useState, useEffect } from 'react';

export const useDevice = (breakpoints = {}) => {
  const defaultBreakpoints = {
    mobile: 768,
    tablet: 1024,
    ...breakpoints
  };

  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: 0
  });

  useEffect(() => {
    const updateDevice = () => {
      if (typeof window === 'undefined') return;

      const width = window.innerWidth;
      
      setDevice({
        width,
        isMobile: width <= defaultBreakpoints.mobile,
        isTablet: width > defaultBreakpoints.mobile && width <= defaultBreakpoints.tablet,
        isDesktop: width > defaultBreakpoints.tablet
      });
    };

    updateDevice();

    let timeoutId;
    const throttledUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDevice, 100);
    };

    window.addEventListener('resize', throttledUpdate);

    return () => {
      window.removeEventListener('resize', throttledUpdate);
      clearTimeout(timeoutId);
    };
  }, [defaultBreakpoints.mobile, defaultBreakpoints.tablet]);

  return device;
};

export const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);
    
    setIsMobile(mediaQuery.matches);
    
    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
};

export default useDevice;