/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    env: {
        BASE_URL: process.env.BASE_URL,
        CLIENT_ID_WIX: process.env.CLIENT_ID_WIX,
        CLIENT_SITE_ID_WIX: process.env.CLIENT_SITE_ID_WIX,
        CLIENT_API_KEY_WIX: process.env.CLIENT_API_KEY_WIX,
        DEBUG_LOGS: process.env.DEBUG_LOGS,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
};

export default nextConfig;  