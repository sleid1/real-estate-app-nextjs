import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
import { Bath, BedDouble, MapPin, Ruler, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UserListing = () => {
   const { toast } = useToast();
   const { user } = useUser();
   const [listing, setListing] = useState();

   const getUserListing = async () => {
      const { data, error } = await supabase
         .from("listing")
         .select("*, listingImages(url, listing_id)")
         .eq("createdBy", user?.primaryEmailAddress.emailAddress);

      if (error) {
         toast({
            title: "Error",
            description: "Server Side Error",
            variant: "destructive",
         });
         return;
      }

      if (data) {
         setListing(data);
      }
   };

   const handleDelete = async (id) => {
      // Start by deleting the associated records from the listingImages table
      let { error: imageError } = await supabase
         .from("listingImages")
         .delete()
         .eq("listing_id", id);

      if (imageError) {
         toast({
            title: "Error",
            description: "Failed to delete associated images.",
            variant: "destructive",
         });
         return;
      }

      // Now delete the record from the listing table
      let { error: listingError } = await supabase
         .from("listing")
         .delete()
         .eq("id", id);

      if (listingError) {
         toast({
            title: "Error",
            description: "Server Side Error",
            variant: "destructive",
         });
         return;
      }

      toast({
         title: "Success",
         description: "Listing Deleted Successfully!",
      });
   };

   useEffect(() => {
      user && getUserListing();
   }, [user]);

   return (
      <div>
         <div>
            <h2 className="font-bold text-2xl">Manage Your Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {listing &&
                  listing.length > 0 &&
                  listing.map((item, index) => (
                     <div
                        className="p-3 hover:border border-primary rounded-lg cursor-pointer relative"
                        key={index}
                     >
                        <h2 className="bg-primary text-white absolute px-2 py-1 m-1 rounded-md text-sm">
                           {item.active ? "Published" : "Draft"}
                        </h2>
                        <Image
                           alt={item?.name}
                           src={
                              item?.listingImages[0]
                                 ? item?.listingImages[0]?.url
                                 : "/placeholder.svg"
                           }
                           width={800}
                           height={150}
                           className="rounded-lg object-cover h-[170px]"
                        />
                        <div className="flex mt-2 flex-col gap-2">
                           <h2 className="font-bold text-xl">{item.name}</h2>
                           <h2 className="font-bold text-xl">€ {item.price}</h2>
                           <h2 className="flex gap-2 text-sm text-gray-400">
                              <MapPin className="h-4 w-4" />
                              {item.address}
                           </h2>
                           <div className="flex gap-2 mt-2 justify-between">
                              <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 w-full text-gray-500 justify-center items-center">
                                 <BedDouble className="h-4 w-4" />
                                 {item?.bedroom}
                              </h2>
                              <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 w-full text-gray-500 justify-center items-center">
                                 <Bath className="h-4 w-4" />
                                 {item?.bathroom}
                              </h2>
                              <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 w-full text-gray-500 justify-center items-center">
                                 <Ruler className="h-4 w-4" />
                                 {item?.area}
                              </h2>
                           </div>
                           <div className="flex gap-2 justify-between">
                              <Link
                                 href={`/view-listing/${item.id}`}
                                 className="w-full"
                              >
                                 <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                 >
                                    View
                                 </Button>
                              </Link>
                              <Link
                                 href={`/edit-listing/${item.id}`}
                                 className="w-full"
                              >
                                 <Button size="sm" className="w-full">
                                    Edit
                                 </Button>
                              </Link>

                              <Button
                                 size="sm"
                                 variant="destructive"
                                 className="flex items-center w-full"
                                 onClick={() => handleDelete(item.id)}
                              >
                                 <Trash className="w-6 h-6" />
                                 Delete
                              </Button>
                           </div>
                        </div>
                     </div>
                  ))}
            </div>
         </div>
      </div>
   );
};

export default UserListing;
