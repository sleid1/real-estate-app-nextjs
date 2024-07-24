"use client";

import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Details from "../_components/Details";
import Slider from "../_components/Slider";

const ViewListing = ({ params }) => {
   const { toast } = useToast();
   const [listing, setListing] = useState({});

   const getListingDetails = async () => {
      let { data, error } = await supabase
         .from("listing")
         .select("*,listingImages(url,listing_id)")
         .eq("id", params.id)
         .eq("active", true);

      if (error) {
         toast({
            title: "Error",
            description: "Server Side Error",
            variant: "destructive",
         });
         return;
      }

      if (data) {
         setListing(data[0]);
      }
   };

   useEffect(() => {
      getListingDetails();
   }, []);

   return (
      <div className="px-12 py-5 md:px-32 lg:px-56">
         <Slider imageList={listing?.listingImages} />
         <Details listingDetail={listing} />
      </div>
   );
};

export default ViewListing;
