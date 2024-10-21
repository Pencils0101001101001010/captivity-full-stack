import { useReducer, useCallback } from "react";
import { FormValues } from "./validations";
import { CartData, OrderData, CartActionResult } from "@/app/(customer)/types";
import { submitOrder } from "./actions";

type SubmitOrderState = {
  loading: boolean;
  error: string | null;
  data: OrderData | null;
};

type SubmitOrderAction =
  | { type: "SUBMIT" }
  | { type: "SUCCESS"; payload: OrderData }
  | { type: "ERROR"; payload: string };

function submitOrderReducer(
  state: SubmitOrderState,
  action: SubmitOrderAction
): SubmitOrderState {
  switch (action.type) {
    case "SUBMIT":
      return { ...state, loading: true, error: null, data: null };
    case "SUCCESS":
      return { ...state, loading: false, error: null, data: action.payload };
    case "ERROR":
      return { ...state, loading: false, error: action.payload, data: null };
    default:
      return state;
  }
}

export function useSubmitOrder() {
  const [state, dispatch] = useReducer(submitOrderReducer, {
    loading: false,
    error: null,
    data: null,
  });

  const submit = useCallback(
    async (formData: FormValues, cartData: CartData): Promise<void> => {
      dispatch({ type: "SUBMIT" });

      try {
        const result: CartActionResult<OrderData> = await submitOrder(
          formData,
          cartData
        );

        if (result.success && result.data) {
          dispatch({ type: "SUCCESS", payload: result.data });
        } else if (!result.success) {
          dispatch({ type: "ERROR", payload: result.error });
        } else {
          // This case handles when success is true but no data is returned
          dispatch({
            type: "ERROR",
            payload: "Order submission failed: No data returned",
          });
        }
      } catch (error) {
        dispatch({
          type: "ERROR",
          payload:
            error instanceof Error
              ? error.message
              : "An unknown error occurred",
        });
      }
    },
    []
  );

  return {
    ...state,
    submit,
  };
}
