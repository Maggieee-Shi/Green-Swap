import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface InventoryUpdate {
  productId: string;
  inventory: number;
  timestamp: number;
}

interface InventoryContextType {
  inventoryUpdates: Map<string, number>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventoryUpdates, setInventoryUpdates] = useState<Map<string, number>>(new Map());
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("/ws"),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/topic/inventory", (message) => {
          const update: InventoryUpdate = JSON.parse(message.body);
          setInventoryUpdates((prev) => {
            const next = new Map(prev);
            next.set(update.productId, update.inventory);
            return next;
          });
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <InventoryContext.Provider value={{ inventoryUpdates }}>
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