"use client";

import React, { useEffect, useState } from "react";
import Listing from "./Listing";
import { supabase } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ListingMapView = ({ type }) => {
   const { toast } = useToast();
   const [listing, setListing] = useState([]);
   const [searchedAddress, setSearchedAddress] = useState("");

   const [isLoading, setIsLoading] = useState(false);
   const [isSearched, setIsSearched] = useState(false);

   const [bedCount, setBedCount] = useState(0);
   const [bathCount, setBathCount] = useState(0);
   const [parkingCount, setParkingCount] = useState(0);
   const [homeType, setHomeType] = useState("");

   useEffect(() => {
      getAllListings();
   }, []);

   const getAllListings = async () => {
      setIsLoading(true);
      let { data, error } = await supabase
         .from("listing")
         .select("*, listingImages(listing_id, url)")
         .eq("active", true)
         .eq("type", type)
         .order("id", { ascending: false });

      if (error) {
         toast({
            title: "Error",
            description: "Server Side Error",
            variant: "destructive",
         });
         setIsLoading(false);
         return;
      }

      if (data) {
         setListing(data);
      }
      setIsLoading(false);
   };

   const handleSearchClick = async () => {
      setIsLoading(true);
      setIsSearched(false);

      const searchTerm = searchedAddress?.label;

      let query = supabase
         .from("listing")
         .select("*, listingImages(listing_id, url)")
         .eq("active", true)
         .eq("type", type)
         .gte("bedroom", bedCount)
         .gte("bathroom", bathCount)
         .gte("parking", parkingCount)
         .like("address", searchTerm ? `%${searchTerm}%` : "%")
         .order("id", { ascending: false });

      if (homeType) {
         query = query.eq("propertyType", homeType);
      }

      let { data, error } = await query;

      if (error) {
         toast({
            title: "Error",
            description: "Server Side Error",
            variant: "destructive",
         });
         setIsLoading(false);
         return;
      }

      if (data) {
         setListing(data);
      }
      setIsLoading(false);
      setIsSearched(true);
   };

   return (
      <div className="grid grid-cols-1 md:grid-cols-2">
         <div>
            <Listing
               listing={listing}
               handleSearchClick={handleSearchClick}
               searchAddress={(v) => setSearchedAddress(v)}
               isSearched={isSearched}
               isLoading={isLoading}
               setBedCount={setBedCount}
               setBathCount={setBathCount}
               setParkingCount={setParkingCount}
               setHomeType={setHomeType}
            />
         </div>
         <div>Map</div>
      </div>
   );
};

export default ListingMapView;
