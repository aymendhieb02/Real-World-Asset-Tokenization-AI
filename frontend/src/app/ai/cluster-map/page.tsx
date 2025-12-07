"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getClusterCentroids,
  getClusterSummary,
  getAllClusters,
  predictCluster,
  type ClusterCentroid,
  type ClusterProperty,
} from "@/lib/api/ml-models";
import { MapPin, Layers, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), {
  ssr: false,
});

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoiYXltZW5kaGllYiIsImEiOiJjbWdxbjQ1aHYxcG80MmlzYTcxdDF6eWY2In0.1dxIrnDo086zaGB8g11tdQ";

export default function ClusterMapPage() {
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([34.0522, -118.2437]); // Default: LA
  const [isClient, setIsClient] = useState(false);

  // Fix Leaflet default icon issue (client-side only)
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        // Fix for default marker icons in Next.js
        delete (L.default as any).Icon.Default.prototype._getIconUrl;
        (L.default as any).Icon.Default.mergeOptions({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
      });
    }
  }, []);

  const { data: summary, error: summaryError } = useQuery({
    queryKey: ["cluster-summary"],
    queryFn: getClusterSummary,
    retry: 2,
    onError: (error) => {
      console.error("[Cluster Map] Error loading summary:", error);
    },
  });

  const { data: centroidsData, error: centroidsError } = useQuery({
    queryKey: ["cluster-centroids"],
    queryFn: getClusterCentroids,
    retry: 2,
    onError: (error) => {
      console.error("[Cluster Map] Error loading centroids:", error);
    },
  });

  // Also load all cluster properties for map points
  const { data: allClustersData, error: allClustersError } = useQuery({
    queryKey: ["all-clusters", 1],
    queryFn: () => getAllClusters(1, 1000),
    retry: 2,
    onError: (error) => {
      console.error("[Cluster Map] Error loading all clusters:", error);
    },
  });

  // Log data when loaded
  useEffect(() => {
    if (centroidsData) {
      console.log("[Cluster Map] Centroids loaded:", centroidsData.centroids?.length || 0, "centroids");
      // Update map center to first centroid if available
      if (centroidsData.centroids && centroidsData.centroids.length > 0) {
        const firstCentroid = centroidsData.centroids[0];
        setMapCenter([firstCentroid.lat, firstCentroid.lng]);
      }
    }
    if (allClustersData) {
      console.log("[Cluster Map] All clusters loaded:", allClustersData.data?.length || 0, "properties");
    }
    if (summary) {
      console.log("[Cluster Map] Summary loaded:", summary);
    }
  }, [centroidsData, allClustersData, summary]);

  // Enhanced color palette for ~2700 clusters - using HSL for better distribution
  const generateClusterColor = (clusterId: number, totalClusters: number = 2700) => {
    // Use HSL color space for better color distribution
    const hue = (clusterId * 137.508) % 360; // Golden angle for better distribution
    const saturation = 70 + (clusterId % 30); // Vary saturation between 70-100
    const lightness = 45 + (clusterId % 20); // Vary lightness between 45-65
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Fallback color palette for smaller sets
  const clusterColors = [
    "#00f0ff", // neon-cyan
    "#a855f7", // purple
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#ec4899", // pink
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#14b8a6", // teal
    "#f97316", // orange
    "#84cc16", // lime
    "#6366f1", // indigo
    "#e11d48", // rose
    "#0ea5e9", // sky
  ];

  const getClusterColor = (clusterId: number, totalClusters?: number) => {
    // Use HSL generation for large cluster sets, fallback to palette for smaller sets
    if (totalClusters && totalClusters > 100) {
      return generateClusterColor(clusterId, totalClusters);
    }
    return clusterColors[clusterId % clusterColors.length];
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Street Cluster Analysis
          </h1>
          <p className="text-foreground/70">
            Visualize property clusters on an interactive map to identify investment hotspots
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Layers size={20} />
                  <span>Cluster Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {summaryError && (
                  <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm mb-3">
                    Error loading summary: {summaryError instanceof Error ? summaryError.message : "Unknown error"}
                  </div>
                )}
                {summary && (
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-foreground/60">Total Clusters</div>
                      <div className="text-2xl font-bold text-neon-cyan">{summary.num_clusters}</div>
                    </div>
                    <div>
                      <div className="text-sm text-foreground/60">Silhouette Score</div>
                      <div className="text-xl font-bold">
                        {(summary.silhouette_score * 100).toFixed(1)}%
                      </div>
                    </div>
                        {summary.cluster_distribution && summary.cluster_distribution.length > 0 && (
                      <div>
                        <div className="text-sm text-foreground/60 mb-2">Distribution</div>
                        <div className="space-y-1 max-h-64 overflow-y-auto">
                          {summary.cluster_distribution.map((dist: any, idx: number) => {
                            const clusterId = dist.cluster_id ?? dist.cluster ?? idx;
                            const totalClusters = summary.num_clusters || 0;
                            return (
                            <div
                              key={`cluster-dist-${clusterId}-${idx}`}
                              className="flex items-center justify-between p-2 rounded glass cursor-pointer hover:bg-white/5 transition-colors"
                              onClick={() => setSelectedCluster(clusterId)}
                              style={{
                                borderLeft: `3px solid ${getClusterColor(clusterId, totalClusters)}`,
                              }}
                            >
                              <span className="text-sm">Cluster {clusterId}</span>
                              <span className="text-sm font-bold">{dist.count || 0}</span>
                            </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {!summary && !summaryError && (
                  <div className="text-sm text-foreground/50">Loading cluster summary...</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: clusterColors[0] }}
                    />
                    <span>High Value Cluster</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: clusterColors[1] }}
                    />
                    <span>Emerging Market</span>
                  </div>
                  <div className="flex items-center space-x2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: clusterColors[2] }}
                    />
                    <span>Stable Area</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {(centroidsError || allClustersError) && (
                  <div className="p-4 m-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400">
                    <div className="font-semibold mb-2">Error loading cluster data</div>
                    <div className="text-sm mb-2">
                      {centroidsError instanceof Error ? centroidsError.message : allClustersError instanceof Error ? allClustersError.message : "Unknown error"}
                    </div>
                    <div className="text-xs mt-2 text-foreground/60 space-y-1">
                      <div>Make sure the unified ML API backend is running:</div>
                      <code className="block bg-black/30 p-2 rounded mt-1">cd ml-api && python main.py</code>
                      <div className="mt-2">Or check the API URL: {process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:5001"}</div>
                    </div>
                  </div>
                )}
                <div className="h-[600px] w-full relative">
                  {isClient && typeof window !== "undefined" && (
                    <MapContainer
                      center={mapCenter}
                      zoom={10}
                      style={{ height: "100%", width: "100%", zIndex: 0 }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {/* Show centroids as larger markers - optimized for ~2700 clusters */}
                      {centroidsData?.centroids && centroidsData.centroids.length > 0 && (
                        centroidsData.centroids.map((centroid: ClusterCentroid, idx: number) => {
                          const clusterId = centroid.cluster_id ?? idx;
                          const totalClusters = centroidsData.centroids?.length || 0;
                          const color = getClusterColor(clusterId, totalClusters);
                          const count = (centroid as any).count || 0;
                          const street = (centroid as any).street || "";
                          
                          // Adjust marker size based on cluster count
                          const radius = Math.min(Math.max(8 + Math.log10(count + 1) * 3, 6), 20);
                          
                          return (
                            <CircleMarker
                              key={`centroid-${clusterId}-${idx}`}
                              center={[centroid.lat, centroid.lng]}
                              radius={radius}
                              pathOptions={{
                                color: color,
                                fillColor: color,
                                fillOpacity: 0.7,
                                weight: 2,
                              }}
                            >
                              <Popup>
                                <div className="text-sm min-w-[200px]">
                                  <div className="font-bold text-base mb-1">Cluster {clusterId}</div>
                                  {street && (
                                    <div className="text-xs text-gray-400 mb-1">Street: {street}</div>
                                  )}
                                  {count > 0 && (
                                    <div className="text-xs text-gray-600 mb-1">
                                      Properties: {count.toLocaleString()}
                                    </div>
                                  )}
                                  <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-300">
                                    Lat: {centroid.lat.toFixed(4)}
                                    <br />
                                    Lng: {centroid.lng.toFixed(4)}
                                  </div>
                                </div>
                              </Popup>
                            </CircleMarker>
                          );
                        })
                      )}
                      
                      {/* Show individual properties as smaller markers */}
                      {allClustersData?.data && allClustersData.data.length > 0 && (
                        allClustersData.data.slice(0, 1000).map((property: ClusterProperty, idx: number) => {
                          // Get lat/lng from property (may be in different fields)
                          const lat = property.lat ?? property.latitude ?? property.Lat ?? property.LAT;
                          const lng = property.lng ?? property.longitude ?? property.lon ?? property.Lng ?? property.LNG;
                          
                          // Skip if coordinates are invalid
                          if (!lat || !lng || typeof lat !== 'number' || typeof lng !== 'number') {
                            return null;
                          }
                          
                          // Validate coordinate ranges
                          if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                            return null;
                          }
                          
                          // Get cluster ID from various possible field names
                          const clusterId = property.street_cluster ?? property.cluster_id ?? property.cluster ?? property.cluster_label ?? 0;
                          const color = getClusterColor(clusterId);
                          
                          return (
                            <CircleMarker
                              key={`property-${property.id || idx}-${lat}-${lng}-${clusterId}`}
                              center={[lat, lng]}
                              radius={3}
                              pathOptions={{
                                color: color,
                                fillColor: color,
                                fillOpacity: 0.5,
                                weight: 1,
                              }}
                            >
                              <Popup>
                                <div className="text-sm">
                                  <div className="font-bold">Property</div>
                                  <div className="text-xs">Cluster: {clusterId}</div>
                                  {property.price && (
                                    <div className="text-xs">Price: ${property.price.toLocaleString()}</div>
                                  )}
                                  {property.city && property.state && (
                                    <div className="text-xs">{property.city}, {property.state}</div>
                                  )}
                                </div>
                              </Popup>
                            </CircleMarker>
                          );
                        })
                      )}
                      
                      {/* Show message if no data */}
                      {(!centroidsData?.centroids || centroidsData.centroids.length === 0) && 
                       (!allClustersData?.data || allClustersData.data.length === 0) && 
                       !centroidsError && !allClustersError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                          <div className="text-center p-4 glass rounded-lg">
                            <div className="text-foreground/60 mb-2">No cluster data available</div>
                            <div className="text-xs text-foreground/50">
                              Make sure the unified ML API backend is running:<br />
                              <code className="text-neon-cyan">cd ml-api && python main.py</code>
                            </div>
                          </div>
                        </div>
                      )}
                    </MapContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

