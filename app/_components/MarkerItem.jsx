import { MarkerF, OverlayView } from "@react-google-maps/api";
import React, { useState } from "react";
import MarkerListingDetail from "./MarkerListingDetail";

const MarkerItem = ({ listing }) => {
   const [selectedListing, setSelectedListing] = useState(null);
   return (
      <div>
         <MarkerF
            position={listing.coordinates}
            icon={{ url: "/pin.png", scaledSize: { width: 60, height: 60 } }}
            onClick={() => setSelectedListing(listing)}
         >
            {selectedListing && (
               <OverlayView
                  position={selectedListing.coordinates}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
               >
                  <div>
                     <MarkerListingDetail
                        item={selectedListing}
                        closeHandler={() => setSelectedListing(null)}
                     />
                  </div>
               </OverlayView>
            )}
         </MarkerF>
      </div>
   );
};

export default MarkerItem;
