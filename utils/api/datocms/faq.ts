import { getCache, setCache, isCacheValid } from "../cache";
import { fetchFromDatoCMS } from "./apiClient";

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const loadFAQFromDatoCMS = async (locale: string) => {
  const CACHE_KEY = `faqDato_${locale}`;

  if (await isCacheValid(CACHE_KEY, CACHE_EXPIRY)) {
    console.log("[DatoCMS FAQ API] Fetching FAQ from cache");
    return await getCache(CACHE_KEY);
  }

  try {
    console.log("[DatoCMS FAQ API] Fetching FAQ from API");
    const query = `
      query MyQuery {
        allFaqs(locale: ${locale}) {
          id
          question
          answer {
            value
          }
        }
      }
    `;

    const data = await fetchFromDatoCMS(query);

    if (data.allFaqs.length > 0) {
      await setCache(CACHE_KEY, data.allFaqs);
      return data.allFaqs;
    } else {
      return await getCache(CACHE_KEY);
    }
  } catch (error) {
    console.error(
      `[DatoCMS FAQ API] Error fetching FAQ data: ${(error as Error).message}`,
    );
    throw error;
  }
};
