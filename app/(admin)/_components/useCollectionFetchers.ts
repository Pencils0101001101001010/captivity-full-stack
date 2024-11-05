import { useMemo } from "react";
import { fetchSummerCollectionTable } from "../admin/products/summer/actions";
import { fetchFashionCollectionTable } from "../admin/products/fashion/actions";
import { fetchIndustrialCollectionTable } from "../admin/products/industrial/actions";
import { fetchKidsCollectionTable } from "../admin/products/kids/actions";
import { fetchAfricanCollectionTable } from "../admin/products/african/actions";
import { fetchLeisureCollectionTable } from "../admin/products/leisure/actions";
import { fetchSignatureCollectionTable } from "../admin/products/signature/actions";
import { fetchSportCollectionTable } from "../admin/products/sport/actions";
import { fetchCamoCollectionTable } from "../admin/products/camo/actions";
import { fetchBaseballCollectionTable } from "../admin/products/baseball/actions";

export function useCollectionFetchers() {
  return useMemo(
    () => ({
      summer: fetchSummerCollectionTable,
      fashion: fetchFashionCollectionTable,
      industrial: fetchIndustrialCollectionTable,
      kids: fetchKidsCollectionTable,
      african: fetchAfricanCollectionTable,
      leisure: fetchLeisureCollectionTable,
      signature: fetchSignatureCollectionTable,
      sport: fetchSportCollectionTable,
      camo: fetchCamoCollectionTable,
      baseball: fetchBaseballCollectionTable,
    }),
    []
  );
}
