import { useCallback, useContext, useState } from "react";
import {
  FingerprintJsProContextInterface,
  FingerprintJsProContext,
} from "./FingerprintJsProContext";
import { QueryResult, VisitorQueryContext, VisitorData } from "./types";

export function useVisitorData(): VisitorQueryContext {
  const { getVisitorData } = useContext<FingerprintJsProContextInterface>(
    FingerprintJsProContext
  );
  const [state, setState] = useState<QueryResult<VisitorData>>({});

  const getData = useCallback<VisitorQueryContext["getData"]>(async () => {
    let result = '';
    try {
      setState((state) => ({ ...state, isLoading: true }));
      result = await getVisitorData();
      setState((state) => ({
        ...state,
        data: { visitorId: result },
        isLoading: false,
        error: undefined,
      }));
    } catch (error) {
      if (error instanceof Error) {
        error.message = `${error.name}: ${error.message}`;
        error.name = "FingerprintJsProAgentError";
        setState((state) => ({
          ...state,
          data: undefined,
          error: error as Error,
        }));
      }
    } finally {
      setState((state) =>
        state.isLoading ? { ...state, isLoading: false } : state
      );
    }
    return { visitorId: result };
  }, [getVisitorData]);

  const { isLoading, data, error } = state;

  return {
    isLoading,
    data,
    error,
    getData,
  };
}
