"use client";

import { useEffect, useRef } from "react";
import maplibregl, { Map, GeoJSONSource } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Item } from "@/lib/types";

export default function MapEmbed({ data }: { data: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    if (!mapRef.current) {
      mapRef.current = new maplibregl.Map({
        container: ref.current,
        style: "https://demotiles.maplibre.org/style.json",
        center: [-58.56, -34.56],
        zoom: 11,
      });
    }
    const pts = data
      .filter(d => typeof d.lon === "number" && typeof d.lat === "number")
      .map(d => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [d.lon!, d.lat!] },
        properties: {},
      }));
    const src = mapRef.current!.getSource("pts") as GeoJSONSource | undefined;
    const geojson = { type: "FeatureCollection", features: pts } as any;
    if (src) {
      src.setData(geojson);
    } else {
      mapRef.current!.addSource("pts", {
        type: "geojson",
        data: geojson,
        cluster: true,
        clusterRadius: 40,
      });
      mapRef.current!.addLayer({
        id: "clusters",
        type: "circle",
        source: "pts",
        filter: ["has", "point_count"],
        paint: { "circle-color": "#4f46e5", "circle-radius": 20, "circle-opacity": 0.6 },
      });
      mapRef.current!.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "pts",
        filter: ["has", "point_count"],
        layout: { "text-field": ["get", "point_count_abbreviated"], "text-size": 12 },
        paint: { "text-color": "#fff" },
      });
      mapRef.current!.addLayer({
        id: "unclustered",
        type: "circle",
        source: "pts",
        filter: ["!has", "point_count"],
        paint: {
          "circle-color": "#10b981",
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });
    }
  }, [data]);

  return <div ref={ref} className="w-full h-full" />;
}
