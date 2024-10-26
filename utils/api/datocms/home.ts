import { getCache, setCache, isCacheValid } from "../cache";
import { fetchFromDatoCMS } from "./apiClient";

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const loadHehroSlidersFromDatoCMS = async (locale: string) => {
  const CACHE_KEY = `homeDato_${locale}`; // Cache key includes locale

  if (await isCacheValid(CACHE_KEY, CACHE_EXPIRY)) {
    console.log("[DatoCMS Home API] Fetching home from cache");
    return await getCache(CACHE_KEY);
  }

  try {
    console.log("[DatoCMS Home API] Fetching home from API");
    const query = `
    query {
      heroSection(locale: ${locale}) {
        sliders {
          id,
          title,
          subHeading,
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
          },
          productId
        }
      }
    }
    `;

    const data = await fetchFromDatoCMS(query);

    if (data.heroSection.sliders.length > 0) {
      await setCache(CACHE_KEY, data.heroSection.sliders);
      return data.heroSection.sliders;
    } else {
      return await getCache(CACHE_KEY);
    }
  } catch (error) {
    console.error(
      `[DatoCMS Home API] Error fetching home data: ${(error as Error).message}`
    );
    throw error;
  }
};
