import { getCache, setCache, isCacheValid } from "../cache";
import { fetchFromDatoCMS } from "./apiClient";

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const loadContactFromDatoCMS = async (locale: string) => {
  const CACHE_KEY = `contactDato_${locale}`;

  if (await isCacheValid(CACHE_KEY, CACHE_EXPIRY)) {
    console.log("[DatoCMS Contact API] Fetching contact from cache");
    return await getCache(CACHE_KEY);
  }

  try {
    console.log("[DatoCMS Contact API] Fetching contact from API");
    const query = `
      query {
        contact(locale: ${locale}) {
          titleDesc {
            id
            title
            description {
              value
            }
          }
          iconLinks {
            id
            icon {
              url
            }
            url
          }
        }
      }
    `;

    const data = await fetchFromDatoCMS(query);

    if (data.contact) {
      await setCache(CACHE_KEY, data.contact);
      return data.contact;
    } else {
      return await getCache(CACHE_KEY);
    }
  } catch (error) {
    console.error(
      `[DatoCMS Contact API] Error fetching contact data: ${(error as Error).message}`
    );
    throw error;
  }
};
