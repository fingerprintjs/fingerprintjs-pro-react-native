import { NativeModules } from "react-native";
import { Region } from "./types";

type VisitorId = string;

export class FingerprintJsProAgent {
  constructor(apiKey: string, region?: Region, endpointUrl?: string) {
    try {
      NativeModules.RNFingerprintjsPro.init(apiKey, region, endpointUrl);
    } catch (e) {
      console.error("RNFingerprintjsPro init error: ", e);
    }
  }

  public getVisitorId(): Promise<VisitorId> {
    try {
      return NativeModules.RNFingerprintjsPro.getVisitorId();
    } catch (e) {
      console.error("RNFingerprintjsPro getVisitorId error: ", e);
      throw new Error("RNFingerprintjsPro getVisitorId error: " + e);
    }
  }
}
