import * as T from "@/types";
import { $http } from "@/axios";

/**
 * Creates a checkout session and returns its URL
 * @param lineItems cart items
 * @returns url to checkout page
 */
export const createCheckout = async (
    lineItems: T.CheckoutLineItem[]
  ): Promise<string | null> => {
    try {
      const response = await $http.post("/checkout", lineItems);
      return response.data.url;
    } catch {
      return null;
    }
  };