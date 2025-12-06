"use client";

import { useEffect, useRef } from "react";
import DottedMap from "dotted-map";
import { cn } from "@/lib/utils";

interface Point {
  lat: number;
  lng: number;
  label?: string;
}

interface WorldMapProps {
  dots?: Array<{ start: Point; end: Point }>;
  lineColor?: string;
  className?: string;
}

export default function WorldMap({
  dots = [],
  lineColor = "#0ea5e9",
  className,
}: WorldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create the base map
    const map = new DottedMap({
      height: 60,
      grid: "diagonal",
    });

    const svgMap = map.getSVG({
      radius: 0.22,
      color: "#00f6ff",
      shape: "circle",
      backgroundColor: "#020617",
    });

    // Clear previous content
    if (svgRef.current) {
      mapRef.current.removeChild(svgRef.current);
    }

    // Create SVG element
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgMap, "image/svg+xml");
    const svgElement = svgDoc.documentElement;

    // Set SVG attributes
    svgElement.setAttribute("width", "100%");
    svgElement.setAttribute("height", "100%");
    svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svgElement.style.position = "absolute";
    svgElement.style.top = "0";
    svgElement.style.left = "0";

    // Convert lat/lng to SVG coordinates
    const latLngToXY = (lat: number, lng: number, width: number, height: number) => {
      const x = ((lng + 180) / 360) * width;
      const y = ((90 - lat) / 180) * height;
      return { x, y };
    };

    // Add lines and dots for connections
    if (dots.length > 0) {
      const width = 1000;
      const height = 500;

      dots.forEach((dot) => {
        const start = latLngToXY(dot.start.lat, dot.start.lng, width, height);
        const end = latLngToXY(dot.end.lat, dot.end.lng, width, height);

        // Create line
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", start.x.toString());
        line.setAttribute("y1", start.y.toString());
        line.setAttribute("x2", end.x.toString());
        line.setAttribute("y2", end.y.toString());
        line.setAttribute("stroke", lineColor);
        line.setAttribute("stroke-width", "2");
        line.setAttribute("opacity", "0.6");
        line.style.animation = "drawLine 2s ease-in-out";
        svgElement.appendChild(line);

        // Create start dot
        const startCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        startCircle.setAttribute("cx", start.x.toString());
        startCircle.setAttribute("cy", start.y.toString());
        startCircle.setAttribute("r", "4");
        startCircle.setAttribute("fill", lineColor);
        startCircle.setAttribute("opacity", "0.8");
        svgElement.appendChild(startCircle);

        // Create end dot
        const endCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        endCircle.setAttribute("cx", end.x.toString());
        endCircle.setAttribute("cy", end.y.toString());
        endCircle.setAttribute("r", "4");
        endCircle.setAttribute("fill", lineColor);
        endCircle.setAttribute("opacity", "0.8");
        svgElement.appendChild(endCircle);

        // Add label if provided
        if (dot.start.label) {
          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", start.x.toString());
          label.setAttribute("y", (start.y - 10).toString());
          label.setAttribute("fill", "#ffffff");
          label.setAttribute("font-size", "12");
          label.setAttribute("text-anchor", "middle");
          label.textContent = dot.start.label;
          svgElement.appendChild(label);
        }
      });
    }

    svgRef.current = svgElement as SVGSVGElement;
    mapRef.current.appendChild(svgElement);
  }, [dots, lineColor]);

  return (
    <div
      ref={mapRef}
      className={cn("relative w-full h-[600px] overflow-hidden rounded-lg", className)}
      style={{ backgroundColor: "#020617" }}
    />
  );
}

