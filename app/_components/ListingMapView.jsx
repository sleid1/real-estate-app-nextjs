"use client";

import React, { useEffect, useState } from "react";
import Listing from "./Listing";
import { supabase } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import GoogleMapSection from "./GoogleMapSection";
import { Button } from "@/components/ui/button";
import { CircleX, Map } from "lucide-react";

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
   const [coordinates, setCoordinates] = useState("");
   const [isMapVisible, setIsMapVisible] = useState(false);

   useEffect(() => {
      const updateMapVisibility = () => {
         if (window.innerWidth >= 768) {
            setIsMapVisible(true);
         } else {
            setIsMapVisible(false);
         }
      };

      // Set initial state
      updateMapVisibility();

      // Add event listener
      window.addEventListener("resize", updateMapVisibility);

      // Cleanup event listener
      return () => {
         window.removeEventListener("resize", updateMapVisibility);
      };
   }, []);

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

   const toggleMapVisibility = () => {
      setIsMapVisible(!isMapVisible);
   };

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
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
               setCoordinates={setCoordinates}
               toggleMapVisibility={toggleMapVisibility}
            />
         </div>
         <div
            className={`fixed inset-5 transition-opacity duration-500 ${
               isMapVisible
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
            } top-24 md:relative md:top-0`}
         >
            <Button
               className="flex gap-2 absolute top-3 right-2 z-50 md:hidden"
               onClick={toggleMapVisibility}
            >
               <CircleX />
               Close
            </Button>
            <GoogleMapSection coordinates={coordinates} listings={listing} />
         </div>
      </div>
   );
};

export default ListingMapView;
