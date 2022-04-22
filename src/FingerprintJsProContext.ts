import { createContext } from "react";

const stub = (): never => {
  throw new Error(
    "You forgot to wrap your component in <FingerprintJsProProvider>."
  );
};

const initialContext = {
  visitorId: "",
  getVisitorData: stub,
};

export interface FingerprintJsProContextInterface {
  visitorId: string;
  getVisitorData: () => Promise<string>;
}

export const FingerprintJsProContext =
  createContext<FingerprintJsProContextInterface>(initialContext);
