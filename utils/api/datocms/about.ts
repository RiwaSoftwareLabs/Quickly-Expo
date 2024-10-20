import { getCache, setCache, isCacheValid } from "../cache";
import { fetchFromDatoCMS } from "./apiClient";

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const loadAboutFromDatoCMS = async (locale: string) => {
  const CACHE_KEY = `aboutDato_${locale}`;

  if (await isCacheValid(CACHE_KEY, CACHE_EXPIRY)) {
    console.log("[DatoCMS About API] Fetching about from cache");
    return await getCache(CACHE_KEY);
  }

  try {
    console.log("[DatoCMS About API] Fetching about from API");
    const query = `
      query {
        about(locale: ${locale}) {
          image {
            responsiveImage(imgixParams: {fit: crop, w: 450, h: 280, auto: format}) {
              sizes
              src
              width
              height
              alt
              title
              base64
            }
          }
          content {
            value
          }
        }
      }
    `;

    const data = await fetchFromDatoCMS(query);

    if (data.about) {
      await setCache(CACHE_KEY, data.about);
      return data.about;
    } else {
      return await getCache(CACHE_KEY);
    }
  } catch (error) {
    console.error(
      `[DatoCMS About API] Error fetching about data: ${(error as Error).message}`,
    );
    throw error;
  }
};
