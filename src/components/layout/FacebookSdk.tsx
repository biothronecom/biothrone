
"use client";

import { siteConfig } from "@/lib/config";
import Script from "next/script";

const { facebook } = siteConfig;

export function FacebookSdk() {
  return (
    <Script
      id="facebook-sdk"
      src="https://connect.facebook.net/en_US/sdk.js"
      strategy="lazyOnload"
      onLoad={() => {
        if (typeof window !== 'undefined' && (window as any).FB) {
            (window as any).FB.init({
              appId: facebook.appId,
              autoLogAppEvents: true,
              xfbml: true,
              version: "v19.0",
            });
        }
      }}
    />
  );
}
