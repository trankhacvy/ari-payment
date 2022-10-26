import { useWallet } from "@solana/wallet-adapter-react";
import { useFetchWithCache } from "hooks/useFetchWithCache";
import { database } from "libs/database";
import { Order } from "types/schema";

const SWR_KEY_GET_ORDERS = "GET_ORDERS";

export function useOrders() {
  const { publicKey } = useWallet();
  const { data, ...rest } = useFetchWithCache(
    publicKey ? [SWR_KEY_GET_ORDERS, publicKey.toBase58()] : null,
    async (_, address) => {
      const { data, error } = await database
        .from("hackathon_orders")
        .select("*,hackathon_payment_links(*,hackathon_products(*))")
        .eq("merchant", address)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Order[];
    }
  );

  return {
    orders: data,
    ...rest,
  };
}
