"use server";
import { logError } from "@/utils";
import queryCollection from "@/utils/FetchFunction";

const BASE_URL = process.env.BASE_URL;

export const fetchLayoutData = async () => {
  try {
    const [
      headerData,
      footerData,
      socialLinks
    ] = await Promise.all([
      queryCollection({ dataCollectionId: "EijentHeader" }),
      queryCollection({ dataCollectionId: "EijentFormContent" }),
      queryCollection({ dataCollectionId: "EijentSocialLinks", sortKey: "orderNumber" }),
    ]);

    if (!Array.isArray(socialLinks.items) || !headerData.items[0] || !footerData.items[0]) {
      throw new Error(`Response does not contain items array`);
    }

    const response = {
      headerData: headerData.items[0],
      footerData: {
        ...footerData.items[0],
        socialLinks: socialLinks.items,
      },
    };

    return response;
  } catch (error) {
    logError(`Error fetching hero section data: ${error.message}`, error);
  }
}

export const joinWaitList = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/api/form-submission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Unable to submit your request. Please try again`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchHomePageData = async () => {
  try {
    const response = await queryCollection({
      dataCollectionId: "EijentHome",
    });

    if (!Array.isArray(response.items)) {
      throw new Error(`Response does not contain items : items property is ${typeof response.items}`);
    }

    return response.items[0];
  } catch (error) {
    logError(`Error fetching home page data: ${error.message}`, error);
  }
};