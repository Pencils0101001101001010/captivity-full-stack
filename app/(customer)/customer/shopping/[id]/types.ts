export type FetchProductByIdResult =
  | { success: true; data: Product }
  | { success: false; error: string };
