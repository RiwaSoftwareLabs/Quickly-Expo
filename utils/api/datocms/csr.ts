import { getCache, setCache, isCacheValid } from "../cache";
import { fetchFromDatoCMS } from "./apiClient";

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const loadCSRFromDatoCMS = async (locale: string) => {
  const CACHE_KEY = `csrDato_${locale}`;

  if (await isCacheValid(CACHE_KEY, CACHE_EXPIRY)) {
    console.log("[DatoCMS CSR API] Fetching CSR from cache");
    return await getCache(CACHE_KEY);
  }

  try {
    console.log("[DatoCMS CSR API] Fetching CSR from API");
    const query = `
      query {
        csr(locale: ${locale}) {
          bannerImage {
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
          sections {
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
            link
          }
        }
      }
    `;

    const data = await fetchFromDatoCMS(query);

    if (data.csr) {
      await setCache(CACHE_KEY, data.csr);
      return data.csr;
    } else {
      return await getCache(CACHE_KEY);
    }
  } catch (error) {
    console.error(
      `[DatoCMS CSR API] Error fetching CSR data: ${(error as Error).message}`,
    );
    throw error;
  }
};
