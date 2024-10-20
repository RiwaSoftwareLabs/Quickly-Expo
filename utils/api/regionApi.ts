// api/cartApi.ts
import apiClient from "./apiClient";
import { getCache, setCache, isCacheValid } from "./cache";

const CACHE_KEY = "regionsData";
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const fetchRegionData = async () => {
  // Check if cache is valid
  if (await isCacheValid(CACHE_KEY, CACHE_EXPIRY)) {
    console.log("[Region API] Fetching regions from cache");
    return await getCache(CACHE_KEY); // Await the cache retrieval
  }

  try {
    console.log("[Region API] Fetching regions from API");
    const response = await apiClient.get("/store/regions");
    const regionData = response.data.regions;

    await setCache(CACHE_KEY, regionData); // Store in cache
    return regionData;
  } catch (error) {
    const errorMessage = (error as Error).message || "Unknown error occurred";
    console.error(`[Region API] Error fetching region data: ${errorMessage}`);
    throw error; // Rethrow the error after logging
  }
};
