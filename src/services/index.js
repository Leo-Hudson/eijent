"use server";
import { logError } from "@/utils";
import queryCollection from "@/utils/FetchFunction";

const BASE_URL = process.env.BASE_URL;

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
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getHomePageData = async () => {
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