import { supabase } from "@/utils/api/apiClient";
import { getCache, setCache, isCacheValid } from "@/utils/api/cache";

const CACHE_KEY = "cartData";
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CartItem {
  id: string;
  variant_id: string;
  variant_title: string;
  product_id: string;
  product_title: string;
  product_subtitle: string;
  thumbnail: string;
  quantity: number;
  unit_price: number;
  isDropdownOpen: boolean;
}

interface Product {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  created_at: string;
}

export const fetchCartData = async () => {
  // const products = await fetchProductData();

  // if (await isCacheValid(CACHE_KEY, CACHE_EXPIRY)) {
  //   console.log("[Cart API] Fetching cart from cache");
  //   return await getCache(CACHE_KEY);
  // }

  // let cartId = (await getCache(CACHE_KEY))?.id;
  // console.log("[Cart API] Cart ID:", cartId);

  // if (!cartId) {
  //   console.log("[Cart API] No cart found, creating a new one");
  //   cartId = await createCart();
  // }

  // try {
  //   console.log("[Cart API] Fetching cart from API");
  //   const response: any = [];
  //   const cartData = response.data.cart;

  //   // Filter cart items to only include those that exist in products
  //   const filteredItems = cartData?.items?.filter((cartItem: CartItem) =>
  //     products.some((product: Product) => product.id === cartItem.product_id),
  //   );

  //   // Update cartData with the filtered items
  //   const updatedCartData = {
  //     ...cartData,
  //     items: filteredItems,
  //   };

  //   if (updatedCartData.items && updatedCartData.items.length > 0) {
  //     await setCache(CACHE_KEY, updatedCartData);
  //     return updatedCartData;
  //   } else {
  //     return await getCache(CACHE_KEY);
  //   }
  // } catch (error) {
  //   const errorMessage = (error as Error).message || "Unknown error occurred";
  //   console.error(`[Cart API] Error fetching cart data: ${errorMessage}`);
  //   throw error;
  // }
};

export const createCart = async () => {
  // try {
  //   // Fetch the region data

  //   // Assuming you want the first region's ID
  //   const regionId = "1222";

  //   // Check if regionId is available
  //   if (!regionId) {
  //     throw new Error("Region ID is not available");
  //   }
  //   const response = await supabase.rpc(
  //     "/store/carts?fields=+items.thumbnail",
  //     {
  //       region_id: regionId,
  //     },
  //   );
  //   const cart = response.data.cart;
  //   await setCache(CACHE_KEY, cart);
  //   return cart.id;
  // } catch (error) {
  //   const errorMessage = (error as Error).message || "Unknown error occurred";
  //   console.error(`[Cart API] Error creating cart: ${errorMessage}`);
  //   throw error;
  // }
};

export const addItemLine = async (
  variant_id: string,
  quantity: number,
  metadata: any,
) => {
  // try {
  //   let cartId = (await getCache(CACHE_KEY))?.id;

  //   if (!cartId) {
  //     console.log("[Cart API] No cart found, creating a new one");
  //     cartId = await createCart();
  //   }

  //   const response = await apiClient.post(
  //     `/store/carts/${cartId}/line-items?fields=+items.thumbnail`,
  //     {
  //       variant_id,
  //       quantity,
  //       metadata,
  //     },
  //   );
  //   const cart = response.data.cart;
  //   if (cart.items && cart.items.length > 0) {
  //     await setCache(CACHE_KEY, cart);
  //     return cart;
  //   } else {
  //     return await getCache(CACHE_KEY);
  //   }
  // } catch (error) {
  //   const errorMessage = (error as Error).message || "Unknown error occurred";
  //   console.error(`[Cart API] Error adding item to cart: ${errorMessage}`);
  //   throw error;
  // }
};

export const updateItemLine = async (
  line_id: string,
  quantity: number,
  metadata: any,
) => {
  // try {
  //   let cartId = (await getCache(CACHE_KEY))?.id;
  //   if (!cartId) throw new Error("No cart found");

  //   const response = await apiClient.post(
  //     `/store/carts/${cartId}/line-items/${line_id}?fields=+items.thumbnail`,
  //     {
  //       quantity,
  //       metadata,
  //     },
  //   );
  //   const cart = response.data.cart;
  //   if (cart.items && cart.items.length > 0) {
  //     await setCache(CACHE_KEY, cart);
  //     return cart;
  //   } else {
  //     return await getCache(CACHE_KEY);
  //   }
  // } catch (error) {
  //   const errorMessage = (error as Error).message || "Unknown error occurred";
  //   console.error(`[Cart API] Error updating line item: ${errorMessage}`);
  //   throw error;
  // }
};

export const deleteItemLine = async (line_id: string) => {
  // try {
  //   let cartId = (await getCache(CACHE_KEY))?.id;
  //   if (!cartId) throw new Error("No cart found");

  //   const response = await apiClient.delete(
  //     `/store/carts/${cartId}/line-items/${line_id}?fields=+items.thumbnail`,
  //   );
  //   const cart = response.data.parent;
  //   await setCache(CACHE_KEY, cart);
  //   return cart;
  // } catch (error) {
  //   const errorMessage = (error as Error).message || "Unknown error occurred";
  //   console.error(`[Cart API] Error deleting line item: ${errorMessage}`);
  //   throw error;
  // }
};
