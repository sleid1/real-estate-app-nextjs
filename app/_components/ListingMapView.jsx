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

      let { data, error } = await supabase
         .from("listing")
         .select("*, listingImages(listing_id, url)")
         .eq("active", true)
         .eq("type", type)
         .like("address", searchTerm ? `%${searchTerm}%` : "%")
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
            />
         </div>
         <div>Map</div>
      </div>
   );
};

export default ListingMapView;
