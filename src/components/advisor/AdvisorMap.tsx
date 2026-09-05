import { DivIcon } from "leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import type { SkiLocation } from "@/data/ski";
import { TILES } from "@/data/map";

/**
 * A DivIcon rather than Leaflet's default marker: the default pulls PNG sprites from
 * the package by relative URL, which the bundler doesn't rewrite. An empty div we
 * style from styles/components.css also means the pin follows the theme.
 */
const MARKER = new DivIcon({ className: "advisor-map__marker", html: "", iconSize: [14, 14], iconAnchor: [7, 7] });

export type AdvisorMapProps = {
  locations: readonly SkiLocation[];
};

export function AdvisorMap({ locations }: AdvisorMapProps) {
  const bounds: LatLngBoundsExpression = locations.map((location) => [location.lat, location.lng]);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [32, 32] }}
      scrollWheelZoom={false}
      className="advisor-map"
    >
      <TileLayer attribution={TILES.attribution} url={TILES.url} />
      {locations.map((location) => (
        <Marker key={location.name} position={[location.lat, location.lng]} icon={MARKER}>
          <Popup>{location.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
