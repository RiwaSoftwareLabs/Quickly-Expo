import apiClient from "./apiClient";
import { getCache, setCache, isCacheValid } from "./cache";
import { fetchRegionData } from "./regionApi"; // Import fetchRegionData

const CACHE_KEY = "productData";
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export const fetchProductData = async () => {
  // Get the region ID
  const data = await fetchRegionData();
  const regionId = data[0]?.id;

  // Check if cache is valid for product data
  if (await isCacheValid(CACHE_KEY, CACHE_EXPIRY)) {
    console.log("[Product API] Fetching products from cache");
    return await getCache(CACHE_KEY);
  }

  try {
    console.log("[Product API] Fetching products from API");
    const response = await apiClient.get(
      `/store/products?region_id=${regionId}&fields=*variants.calculated_price,*variants.inventory_quantity`,
    );
    const productData = response.data.products;

    if (productData && productData.length > 0) {
      await setCache(CACHE_KEY, productData);
      return productData;
    } else {
      return await getCache(CACHE_KEY);
    }
  } catch (error) {
    const errorMessage = (error as Error).message || "Unknown error occurred";
    console.error(`[Product API] Error fetching product data: ${errorMessage}`);
    throw error;
  }
};

// Fetch Product Details by ID
export const fetchProductDetails = async (id: string) => {
  // Get the region ID
  const data = await fetchRegionData();
  const regionId = data[0]?.id;

  // Check if cache is valid for product data
  if (await isCacheValid(CACHE_KEY, CACHE_EXPIRY)) {
    console.log("[Product API] Fetching product details from cache");
    const cachedData = await getCache(CACHE_KEY);
    if (cachedData && Array.isArray(cachedData)) {
      const cachedProduct = cachedData.find(
        (product: any) => product.id === id,
      );
      if (cachedProduct) {
        return cachedProduct;
      }
    }
  }

  try {
    console.log("[Product API] Fetching product details from API");
    const response = await apiClient.get(
      `/store/products/${id}?region_id=${regionId}&fields=*variants.calculated_price,*variants.inventory_quantity`,
    );
    const productDetails = response.data.product;

    // Update cache if productDetails exist, otherwise return empty object
    if (productDetails) {
      const cachedData = await getCache(CACHE_KEY);
      if (Array.isArray(cachedData)) {
        const updatedCache = cachedData.map((product: any) =>
          product.id === productDetails.id ? productDetails : product,
        );
        if (
          !updatedCache.some((product: any) => product.id === productDetails.id)
        ) {
          updatedCache.push(productDetails);
        }
        await setCache(CACHE_KEY, updatedCache);
      } else {
        await setCache(CACHE_KEY, [productDetails]);
      }
      return productDetails;
    } else {
      const cachedData = await getCache(CACHE_KEY);
      if (cachedData && Array.isArray(cachedData)) {
        const cachedProduct = cachedData.find(
          (product: any) => product.id === id,
        );
        if (cachedProduct) {
          return cachedProduct;
        } else {
          return {};
        }
      }
    }
  } catch (error) {
    const errorMessage = (error as Error).message || "Unknown error occurred";
    console.error(
      `[Product API] Error fetching product details: ${errorMessage}`,
    );
    throw error;
  }
};
