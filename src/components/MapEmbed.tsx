"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

type Point = { lat: number; lon: number; label: string };
type Props = { points: Point[]; height?: number };

export default function MapEmbed({ points, height = 420 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !points.length) return;
    const map = new maplibregl.Map({
      container: ref.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [-58.55, -34.57],
      zoom: 12,
    });

    const fc = {
      type: "FeatureCollection",
      features: points.map(p => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [p.lon, p.lat] },
        properties: { label: p.label },
      })),
    } as GeoJSON.FeatureCollection;

    map.on("load", () => {
      map.addSource("edu", {
        type: "geojson",
        data: fc,
        cluster: true,
        clusterRadius: 50,
        clusterMaxZoom: 14,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "edu",
        filter: ["has", "point_count"],
        paint: {
          "circle-color": "#2563eb",
          "circle-radius": [
            "step", ["get", "point_count"],
            16, 20, 20, 50, 24
          ],
          "circle-opacity": 0.85
        }
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "edu",
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-size": 12
        },
        paint: { "text-color": "#ffffff" }
      });

      map.addLayer({
        id: "unclustered",
        type: "circle",
        source: "edu",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#10b981",
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#0f172a"
        }
      });

      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
        const clusterId = features[0].properties?.cluster_id;
        const source = map.getSource("edu") as maplibregl.GeoJSONSource;
        // @ts-expect-error - MapLibre's getClusterExpansionZoom signature
        source.getClusterExpansionZoom(clusterId, (err: Error | null, zoom: number) => {
          if (err) return;
          const coords = (features[0].geometry as GeoJSON.Point).coordinates as [number, number];
          map.easeTo({ center: coords, zoom });
        });
      });

      map.on("click", "unclustered", (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const [lng, lat] = (f.geometry as GeoJSON.Point).coordinates as [number, number];
        new maplibregl.Popup()
          .setLngLat([lng, lat])
          .setText(f.properties?.label || "")
          .addTo(map);
      });

      map.on("mouseenter", "clusters", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "clusters", () => { map.getCanvas().style.cursor = ""; });
      map.on("mouseenter", "unclustered", () => { map.getCanvas().style.cursor = "pointer"; });
      map.on("mouseleave", "unclustered", () => { map.getCanvas().style.cursor = ""; });
    });

    // Fit bounds
    const bounds = new maplibregl.LngLatBounds();
    points.forEach(p => bounds.extend([p.lon, p.lat]));
    if (!bounds.isEmpty()) map.fitBounds(bounds, { padding: 40, maxZoom: 15 });

    return () => map.remove();
  }, [points]);

  if (!points.length) return null;
  return <div ref={ref} style={{ height }} className="rounded-md border" />;
}
