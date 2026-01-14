import type { Metadata } from "next";
import AbTestLandingClient from "./AbTestLandingClient";

export const metadata: Metadata = {
  title: "Premier Deals A/B Landing",
  description: "A/B test landing page inspired by the Premier Deals PWA layout.",
};

export default function AbTestLandingPage() {
  return <AbTestLandingClient />;
}
