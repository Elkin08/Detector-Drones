import { Poppins, Montserrat, Orbitron } from "next/font/google";

export const font = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "900"],
});

export const headingFont = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const neonFont = Orbitron({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});
