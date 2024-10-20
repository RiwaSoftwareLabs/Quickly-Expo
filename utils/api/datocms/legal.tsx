import { getCache, setCache, isCacheValid } from "../cache";
import { fetchFromDatoCMS } from "./apiClient";

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const loadLegalFromDatoCMS = async (locale: string) => {
  const CACHE_KEY = `legalDato_${locale}`;

  if (await isCacheValid(CACHE_KEY, CACHE_EXPIRY)) {
    console.log("[DatoCMS Legal API] Fetching legal from cache");
    return await getCache(CACHE_KEY);
  }

  try {
    console.log("[DatoCMS Legal API] Fetching legal from API");
    const query = `
        query MyQuery {
            allLegals(locale: ${locale}) {
                id
                title
                content {
                  value
                }
                slug
                _status
            }
        }
    `;

    const data = await fetchFromDatoCMS(query);

    if (data.allLegals.length > 0) {
      await setCache(CACHE_KEY, data.allLegals);
      return data.allLegals;
    } else {
      return await getCache(CACHE_KEY);
    }
  } catch (error) {
    console.error(
      `[DatoCMS Legal API] Error fetching legal data: ${(error as Error).message}`,
    );
    throw error;
  }
};
