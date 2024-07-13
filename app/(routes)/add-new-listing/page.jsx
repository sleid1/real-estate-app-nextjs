"use client";

import GoogleAddressSearch from "@/app/_components/GoogleAddressSearch";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const AddNewListing = () => {
   const { toast } = useToast();
   const [selectedAddress, setSelectedAddress] = useState();
   const [coordinates, setCoordinates] = useState();
   const { user } = useUser();
   const router = useRouter();

   const [loader, setLoader] = useState(false);

   const nextHandler = async () => {
      setLoader(true);
      const { data, error } = await supabase
         .from("listing")
         .insert([
            {
               address: selectedAddress.label,
               coordinates: coordinates,
               createdBy: user.primaryEmailAddress.emailAddress,
            },
         ])
         .select();

      if (data) {
         setLoader(false);
         console.log("New Data added,", data);
         toast({
            title: "Success !",
            description: "New Address added for listing !",
         });
         router.replace(`/edit-listing/${data[0].id}`);
      }

      if (error) {
         setLoader(false);
         console.log("Error", error);
         toast({
            title: "Error !",
            description: error.message,
            variant: "destructive",
         });
      }
   };

   return (
      <div className="mt-10 md:mx-56 lg:mx-80">
         <div className="p-10 flex flex-col gap-5 items-center justify-center">
            <h2 className="font-bold text-2xl">Add New Listing</h2>
            <div className="w-full p-10 rounded-lg border shadow-md flex flex-col gap-5">
               <h2 className="text-gray-500">
                  Enter Address which you want to list
               </h2>
               <GoogleAddressSearch
                  setSelectedAddress={(value) => setSelectedAddress(value)}
                  setCoordinates={(value) => setCoordinates(value)}
               />
               <Button
                  disabled={!setSelectedAddress || !coordinates || loader}
                  onClick={nextHandler}
               >
                  {loader ? <Loader className="animate-spin" /> : "Next"}
               </Button>
            </div>
         </div>
      </div>
   );
};

export default AddNewListing;
