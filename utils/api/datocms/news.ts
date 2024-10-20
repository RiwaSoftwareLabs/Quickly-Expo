import { getCache, setCache, isCacheValid } from "../cache";
import { fetchFromDatoCMS } from "./apiClient";

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const loadNewsFromDatoCMS = async (locale: string) => {
  const CACHE_KEY = `newsDato_${locale}`;

  if (await isCacheValid(CACHE_KEY, CACHE_EXPIRY)) {
    console.log("[DatoCMS News API] Fetching news from cache");
    return await getCache(CACHE_KEY);
  }

  try {
    console.log("[DatoCMS News API] Fetching news from API");
    const query = `
    query {
      allNewsArticles(locale: ${locale}) {
         id,
      title,
      content{
    	  value
      },
      image{
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
      publishedAt
        }
    }
    `;

    const data = await fetchFromDatoCMS(query);

    if (data.allNewsArticles.length > 0) {
      await setCache(CACHE_KEY, data.allNewsArticles);
      return data.allNewsArticles;
    } else {
      return await getCache(CACHE_KEY);
    }
  } catch (error) {
    console.error(
      `[DatoCMS News API] Error fetching news data: ${(error as Error).message}`,
    );
    throw error;
  }
};
