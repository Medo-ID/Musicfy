"use server";

import { ProductWithPrice } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function getActiveProductsWithPrices(): Promise<
  ProductWithPrice[] | []
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, prices(*)")
    .eq("active", true)
    .eq("prices.active", true)
    .order("metadata->index")
    .order("unit_amount", { foreignTable: "prices" });

  if (error) {
    console.log(error);
  }

  return data || [];
}
