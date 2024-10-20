import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { fetchCartData } from "@/utils/api/cartApi";

// Define the type for the context value
interface CartContextType {
  cartData: any; // Replace 'any' with a more specific type if possible
  setCartData: React.Dispatch<React.SetStateAction<any>>; // Replace 'any' with a more specific type if possible
  refreshCart: () => Promise<void>;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Define the props for the CartProvider
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartData, setCartData] = useState<any>(null); // Replace 'any' with a more specific type if possible

  // Load initial cart data
  const loadCartData = async () => {
    const data = await fetchCartData();
    setCartData(data);
  };

  useEffect(() => {
    loadCartData();
  }, []);

  const value = {
    cartData,
    setCartData,
    refreshCart: loadCartData, // Expose this function to manually refresh the cart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook to use CartContext
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
