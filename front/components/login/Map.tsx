"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

// آیکون پیش‌فرض Leaflet را اصلاح می‌کنیم
(L.Icon.Default.prototype as any)._getIconUrl = function () {
  return "my-icon.png";
};
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
  latitude: number | null;
  longitude: number | null;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
};

const LocationPicker = ({ latitude, longitude, setLatitude, setLongitude }: Props) => {
  const MarkerSetter = () => {
    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[latitude || 35.7, longitude || 51.4]} // تهران به عنوان پیش‌فرض
      zoom={13}
      style={{ height: 300, width: "100%", borderRadius: 10 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {latitude && longitude && <Marker position={[latitude, longitude]} />}
      <MarkerSetter />
    </MapContainer>
  );
};

export default LocationPicker;
