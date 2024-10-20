import apiClient from "./apiClient";
import { clearCache } from "./cache";
const CACHE_KEY = "cartData";

/**
 * Create a payment collection for the given cart.
 * @param cartId ID of the cart.
 * @param providerId ID of the selected payment provider.
 * @returns The payment collection ID.
 */
export const createPaymentCollection = async (
  cartId: string,
  providerId: string,
) => {
  // Create or update the payment collection
  const { data: paymentCollectionData } = await apiClient.post(
    `/store/payment-collections`,
    {
      cart_id: cartId,
    },
  );

  const paymentCollectionId = paymentCollectionData.payment_collection.id;

  // Initialize payment session with the selected provider
  await apiClient.post(
    `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
    {
      provider_id: providerId,
    },
  );

  return paymentCollectionId;
};

/**
 * Complete the order by completing the cart.
 * @param cartId ID of the cart.
 * @returns The updated cart data.
 */

export const completeOrder = async (id: string) => {
  try {
    const response = await apiClient.post(`/store/carts/${id}/complete`);
    const data = response.data;
    await clearCache(CACHE_KEY);
    return data;
  } catch (error) {
    throw error;
  }
};
