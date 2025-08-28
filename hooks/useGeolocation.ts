"use client"

import { useEffect, useState, useCallback } from "react";
import type { LatLng } from "@/lib/geo";

type State =
  | { status: "idle"; coords?: LatLng; error?: string }
  | { status: "loading"; coords?: LatLng; error?: string }
  | { status: "ready"; coords: LatLng; error?: string }
  | { status: "error"; coords?: LatLng; error: string };

export function useGeolocation() {
  const [state, setState] = useState<State>({ status: "idle" });

  const request = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setState({ status: "error", error: "Geolocalización no soportada." });
      return;
    }
    setState({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        try { localStorage.setItem("nearby.coords", JSON.stringify(coords)); } catch {}
        setState({ status: "ready", coords });
      },
      (err) => {
        setState({
          status: "error",
          error: err.code === 1 ? "Permiso denegado." : "No se pudo obtener tu ubicación.",
        });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const cached = localStorage.getItem("nearby.coords");
    if (cached) {
      try {
        const coords = JSON.parse(cached) as LatLng;
        if (coords && typeof coords.lat === "number" && typeof coords.lng === "number") {
          setState({ status: "ready", coords });
        }
      } catch {}
    }
  }, []);

  return { ...state, request };
}


