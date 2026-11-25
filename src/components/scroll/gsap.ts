"use client";

/** GSAP registrado uma única vez para todo o app. */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/** Curvas e tempos "high ticket": desaceleração longa, sem quique */
export const EASE = {
  signature: "expo.out",
  scrub: 1.2,
  micro: "power3.out",
};

/** Animações só para quem não pediu menos movimento */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
