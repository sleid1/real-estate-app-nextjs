import React, { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import MarkerItem from "./MarkerItem";
import { Button } from "@/components/ui/button";
import { CircleX } from "lucide-react";

const containerStyle = {
   width: "100%",
   height: "100%",
};

function GoogleMapSection({ coordinates, listings }) {
   const [center, setCenter] = useState({
      lat: 45.22660755,
      lng: 13.60158819,
   });

   // const { isLoaded } = useJsApiLoader({
   //    id: "google-map-script",
   //    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY,
   // });

   const [map, setMap] = React.useState(null);

   useEffect(() => {
      coordinates && setCenter(coordinates);
   }, [coordinates]);

   const onLoad = React.useCallback(function callback(map) {
      // This is just an example of getting and using the map instance!!! don't just blindly copy!
      const bounds = new window.google.maps.LatLngBounds(center);
      map.fitBounds(bounds);

      setMap(map);
   }, []);

   const onUnmount = React.useCallback(function callback(map) {
      setMap(null);
   }, []);

   return (
      <GoogleMap
         mapContainerStyle={containerStyle}
         center={center}
         zoom={12}
         onLoad={onLoad}
         onUnmount={onUnmount}
      >
         {/* Child components, such as markers, info windows, etc. */}
         {listings.map((listing, index) => (
            <MarkerItem key={index} listing={listing} />
         ))}
      </GoogleMap>
   );
}

export default React.memo(GoogleMapSection);
