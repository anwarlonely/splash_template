import React from "react";
import LandingPage from "../app/LandingPage";
export async function generateMetadata() {
  const ImageURL = process.env.NEXT_PUBLIC_IMAGE_URL;
  return {
    title:
      "Home - Splash Distributors: E-liquids,Salt NIC & Vape Supplies and more",
    description:
      "Find the best DISPOSABLE, NEW ARRIVALS, POSH DISPO products at Splash Distributors LLC",
    openGraph: {
      images: [`${ImageURL}/2024/03/ad_logo.png`, []],
    },
  };
}
const page = () => {
  return <LandingPage />;
};

export default page;
