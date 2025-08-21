"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

type Props = {
  points: { lat: number; lon: number; label: string }[];
  height?: number;
};

export default function MapEmbed({ points, height = 360 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !points.length) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-58.55, -34.57],
      zoom: 12,
    });
    const bounds = new maplibregl.LngLatBounds();
    points.forEach(p => {
      new maplibregl.Marker().setLngLat([p.lon, p.lat]).setPopup(new maplibregl.Popup().setText(p.label)).addTo(map);
      bounds.extend([p.lon, p.lat]);
    });
    map.fitBounds(bounds, { padding: 40, maxZoom: 16 });
    return () => map.remove();
  }, [points]);
  if (!points.length) return null;
  return <div ref={ref} style={{ height }} className="rounded-md border" />;
}
