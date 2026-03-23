import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface InventoryUpdate {
  productId: string;
  inventory: number;
  timestamp: number;
}

interface InventoryContextType {
  inventoryUpdates: Map<string, number>;
  subscribeToInventory: () => void;
  unsubscribeFromInventory: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventoryUpdates, setInventoryUpdates] = useState<Map<string, number>>(new Map());
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!isSubscribed) return;

    // Simulate WebSocket STOMP connection for real-time inventory updates
    console.log("🔌 WebSocket STOMP: Connected to /topic/inventory");
    
    // Simulate random inventory updates every 10-20 seconds
    const interval = setInterval(() => {
      const productIds = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
      const randomProductId = productIds[Math.floor(Math.random() * productIds.length)];
      const randomInventory = Math.floor(Math.random() * 5);
      
      const update: InventoryUpdate = {
        productId: randomProductId,
        inventory: randomInventory,
        timestamp: Date.now(),
      };
      
      console.log("📦 WebSocket STOMP: Inventory update received", update);
      
      setInventoryUpdates((prev) => {
        const newMap = new Map(prev);
        newMap.set(update.productId, update.inventory);
        return newMap;
      });
      
      // Show toast notification for low inventory
      if (randomInventory <= 2 && randomInventory > 0) {
        toast.warning(`Stock alert: Product ${randomProductId} - Only ${randomInventory} left!`);
      } else if (randomInventory === 0) {
        toast.error(`Product ${randomProductId} is now out of stock`);
      }
    }, 15000); // Update every 15 seconds

    return () => {
      clearInterval(interval);
      console.log("🔌 WebSocket STOMP: Disconnected from /topic/inventory");
    };
  }, [isSubscribed]);

  const subscribeToInventory = () => {
    setIsSubscribed(true);
  };

  const unsubscribeFromInventory = () => {
    setIsSubscribed(false);
  };

  return (
    <InventoryContext.Provider
      value={{
        inventoryUpdates,
        subscribeToInventory,
        unsubscribeFromInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
