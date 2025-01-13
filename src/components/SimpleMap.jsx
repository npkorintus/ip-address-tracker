import React, { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function SimpleMap ({ lat, lng }) {
  const mapRef = useRef(null);
  // const latitude = 51.505;
  // const longitude = -0.09;
  const position=[lat, lng];

  return ( 
    // Make sure you set the height and width of the map container otherwise the map won't show
    <MapContainer
      center={position} 
      zoom={13} 
      ref={mapRef} 
      style={{height: "100vh", width: "100vw"}}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};
