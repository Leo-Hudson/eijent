import { ApiKeyStrategy, createClient } from "@wix/sdk";
import { collections, items } from "@wix/data";
import { submissions } from "@wix/forms";

const isDebugMode = process.env.DEBUG_LOGS === "1";

export const logError = (...args) => {
    if (isDebugMode) console.error(...args);
};

export const createWixClient = async () => {
    try {
        const wixClient = createClient({
            modules: {
                collections,
                items,
                submissions,
            },
            auth: ApiKeyStrategy({
                siteId: process.env.CLIENT_SITE_ID_WIX,
                apiKey: process.env.CLIENT_API_KEY_WIX,
            })
        });
        return wixClient;
    } catch (error) {
        logError("Error creating wix client: ", error);
    }
};