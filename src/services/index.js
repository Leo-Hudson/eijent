"use server";
import { logError } from "@/utils";
import queryCollection from "@/utils/FetchFunction";

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

export const fetchHomePageData = async () => {
  try {
    const [
      homePageData,
      heroSectionData,
      stickyMessagesData
    ] = await Promise.all([
      queryCollection({ dataCollectionId: "EijentHome" }),
      queryCollection({ dataCollectionId: "EijentHeroSection" }),
      queryCollection({ dataCollectionId: "StickyMessages", sortKey: "orderNumber" }),
    ]);    

    if (!homePageData.items[0] || !heroSectionData.items[0] || !Array.isArray(stickyMessagesData.items)) {
      throw new Error(`Response does not contain items array`);
    }

    const response = {
      homePageData: homePageData.items[0],
      heroSectionData: heroSectionData.items[0],
      stickyMessagesData: stickyMessagesData.items
    };

    return response;
  } catch (error) {
    logError(`Error fetching homepage data: ${error.message}`, error);
  }
}