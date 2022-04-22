import { NativeModules } from "react-native";
import { Region } from "./types";

const { RNFingerprintjsPro } = NativeModules;

type VisitorId = string;

export class FingerprintJsProAgent {
  constructor(apiKey: string, region?: Region, endpointUrl?: string) {
    try {
      RNFingerprintjsPro.init(apiKey, region, endpointUrl);
    } catch (e) {
      console.error("RNFingerprintjsPro init error: ", e);
    }
  }

  public getVisitorId(): Promise<VisitorId> {
    try {
      return RNFingerprintjsPro.getVisitorId();
    } catch (e) {
      console.error("RNFingerprintjsPro getVisitorId error: ", e);
      throw new Error("RNFingerprintjsPro getVisitorId error: " + e);
    }
  }
}
