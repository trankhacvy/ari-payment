import { useWallet } from "@solana/wallet-adapter-react";
import { useFetchWithCache } from "hooks/useFetchWithCache";
import { database } from "libs/database";
import { Product } from "types/schema";

const SWR_KEY_GET_PRODUCTS = "GET_PRODUCTS";

export function useGetProducts() {
  const { publicKey } = useWallet();
  const { data, ...rest } = useFetchWithCache(
    publicKey ? [SWR_KEY_GET_PRODUCTS, publicKey.toBase58()] : null,
    async (_, address) => {
      const { data, error } = await database
        .from("hackathon_products")
        .select("*")
        .eq("merchant", address)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Product[];
    }
  );

  return {
    products: data,
    ...rest,
  };
}
