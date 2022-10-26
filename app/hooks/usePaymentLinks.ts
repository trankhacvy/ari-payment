import { useWallet } from "@solana/wallet-adapter-react";
import { useFetchWithCache } from "hooks/useFetchWithCache";
import { database } from "libs/database";
import { PaymentLink } from "types/schema";

const SWR_KEY_GET_PAYMENT_LINKS = "GET_PAYMENT_LINKS";

export function useGetPaymentLinks() {
  const { publicKey } = useWallet();

  const { data, ...rest } = useFetchWithCache(
    publicKey ? [SWR_KEY_GET_PAYMENT_LINKS, publicKey.toBase58()] : null,
    async (_, address) => {
      const { data, error } = await database
        .from("hackathon_payment_links")
        .select("*,hackathon_products(*)")
        .eq("merchant", address)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data as unknown as PaymentLink[];
    }
  );

  return {
    paymentLinks: data,
    ...rest,
  };
}
