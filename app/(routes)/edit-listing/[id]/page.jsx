"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { Formik } from "formik";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import FileUpload from "../_components/FileUpload";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EditListing = ({ params }) => {
   const { toast } = useToast();
   const { user, isLoaded } = useUser();
   const router = useRouter();

   const [listing, setListing] = useState(null);
   const [images, setImages] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (!isLoaded) {
         return;
      }

      if (!user) {
         router.replace(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL);
         return;
      }

      verifyUserRecord();
   }, [user]);

   const verifyUserRecord = async () => {
      try {
         const { data, error } = await supabase
            .from("listing")
            .select("*, listingImages (listing_id, url)")
            .eq("createdBy", user?.primaryEmailAddress.emailAddress)
            .eq("id", params.id);

         if (error) {
            throw error;
         }

         if (data && data.length > 0) {
            console.log(data);
            setListing(data[0]);
         } else {
            router.replace("/");
         }
      } catch (error) {
         toast({
            title: "Error !",
            description: error.message,
            variant: "destructive",
         });
         console.error("Error fetching listing:", error.message);
      }
   };

   const onSubmitHandler = async (formValues) => {
      try {
         setLoading(true);
         const { data, error } = await supabase
            .from("listing")
            .update(formValues)
            .eq("id", params.id)
            .select();

         if (error) {
            throw error;
         }

         if (data) {
            toast({
               title: "Success !",
               description: "Listing has been updated !",
            });
         }

         if (images.length > 0) {
            for (const image of images) {
               const file = image;
               const fileName =
                  user?.primaryEmailAddress.emailAddress +
                  " - " +
                  new Date().toLocaleString("hr");
               const fileExtension = file.name.split(".").pop();
               const { data, error } = await supabase.storage
                  .from("listingImages")
                  .upload(`${fileName}`, file, {
                     contentType: `image/${fileExtension}`,
                     upsert: false,
                  });

               if (error) {
                  toast({
                     title: "Error",
                     description: "Failed to upload files. Please try again.",
                     variant: "destructive",
                  });
               } else {
                  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;

                  const { data, error } = await supabase
                     .from("listingImages")
                     .insert([{ url: imageUrl, listing_id: params.id }])
                     .select();
               }
            }
         }
         setLoading(false);
      } catch (error) {
         console.error("Error updating listing:", error.message);
         toast({
            title: "Error",
            description: "Failed to update listing. Please try again.",
            variant: "destructive",
         });
      }
   };

   const publishButtonHandler = async () => {
      setLoading(true);
      const { data, error } = await supabase
         .from("listing")
         .update({ active: true })
         .eq("id", params.id)
         .select();

      if (data) {
         setLoading(false);
         toast({
            title: "Success !",
            description: "Listing has been published !",
         });
      }
   };

   if (!listing) {
      return (
         <div className="h-[50vh] grid place-items-center px-10 md:px-36 my-10">
            <LoaderCircle size={48} className="animate-spin" />
         </div>
      );
   }

   return (
      <div className="px-10 md:px-36 my-10">
         <h2 className="font-bold text-2xl">
            Enter some more details about your listing
         </h2>

         <Formik
            initialValues={{
               type: listing.type,
               propertyType: listing.propertyType,
               profileImage: user?.imageUrl,
               fullName: user?.fullName,
            }}
            onSubmit={(values) => {
               console.log(values);
               onSubmitHandler(values);
            }}
         >
            {({ values, handleChange, handleSubmit, setFieldValue }) => (
               <form onSubmit={handleSubmit}>
                  <div className="p-5 border rounded-lg shadow-md grid gap-7 mt-6">
                     <div className="flex gap-2 flex-col">
                        <h2 className="text-gray-500">Property name</h2>
                        <Input
                           type="text"
                           placeholder="Luxury Villa With Sea View"
                           defaultValue={listing?.name}
                           name="name"
                           onChange={handleChange}
                        />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <div className="flex flex-col gap-2">
                           <h2 className="text-gray-500">Rent or Sell ?</h2>
                           <RadioGroup
                              defaultValue={listing?.type}
                              onValueChange={(value) =>
                                 setFieldValue("type", value)
                              }
                           >
                              <div className="flex items-center space-x-2">
                                 <RadioGroupItem value="Sell" id="Sell" />
                                 <Label htmlFor="Sell" className="text-lg">
                                    Sell
                                 </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                 <RadioGroupItem value="Rent" id="Rent" />
                                 <Label htmlFor="Rent" className="text-lg">
                                    Rent
                                 </Label>
                              </div>
                           </RadioGroup>
                        </div>
                        <div className="flex gap-2 flex-col">
                           <h2 className="text-gray-500">
                              Select Property Type
                           </h2>
                           <Select
                              name="propertyType"
                              defaultValue={listing?.propertyType}
                              onValueChange={(value) =>
                                 setFieldValue("propertyType", value)
                              }
                           >
                              <SelectTrigger className="w-[180px]">
                                 <SelectValue
                                    placeholder={
                                       listing?.propertyType ||
                                       "Select Property Type"
                                    }
                                 />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="Single Family House">
                                    Single Family House
                                 </SelectItem>
                                 <SelectItem value="Town House">
                                    Town House
                                 </SelectItem>
                                 <SelectItem value="Condo">Condo</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <div className="flex gap-2 flex-col">
                           <h2 className="text-gray-500">Bedroom</h2>
                           <Input
                              type="number"
                              placeholder="Ex.2"
                              defaultValue={listing?.bedroom}
                              name="bedroom"
                              onChange={handleChange}
                           />
                        </div>
                        <div className="flex gap-2 flex-col">
                           <h2 className="text-gray-500">Bathroom</h2>
                           <Input
                              type="number"
                              placeholder="Ex.2"
                              defaultValue={listing?.bathroom}
                              name="bathroom"
                              onChange={handleChange}
                           />
                        </div>
                        <div className="flex gap-2 flex-col">
                           <h2 className="text-gray-500">Built In</h2>
                           <Input
                              type="number"
                              placeholder="Ex. 1900 m2"
                              defaultValue={listing?.builtIn}
                              name="builtIn"
                              onChange={handleChange}
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <div className="flex gap-2 flex-col">
                           <h2 className="text-gray-500">Parking</h2>
                           <Input
                              type="number"
                              placeholder="Ex.2"
                              defaultValue={listing?.parking}
                              name="parking"
                              onChange={handleChange}
                           />
                        </div>
                        <div className="flex gap-2 flex-col">
                           <h2 className="text-gray-500">Lot Size (m2)</h2>
                           <Input
                              type="number"
                              placeholder=""
                              defaultValue={listing?.lotSize}
                              name="lotSize"
                              onChange={handleChange}
                           />
                        </div>
                        <div className="flex gap-2 flex-col">
                           <h2 className="text-gray-500">Area (m2)</h2>
                           <Input
                              type="number"
                              placeholder="Ex. 1900 m2"
                              defaultValue={listing?.area}
                              name="area"
                              onChange={handleChange}
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <div className="flex gap-2 flex-col">
                           <h2 className="text-gray-500">Selling Price (€)</h2>
                           <Input
                              placeholder="400.000"
                              defaultValue={listing?.price}
                              name="price"
                              onChange={handleChange}
                           />
                        </div>
                        <div className="flex gap-2 flex-col">
                           <h2 className="text-gray-500">
                              HOA (Per Month) (€)
                           </h2>
                           <Input
                              placeholder="100"
                              defaultValue={listing?.hoa}
                              name="hoa"
                              onChange={handleChange}
                           />
                        </div>
                     </div>
                     <div className="grid grid-cols-1 gap-10">
                        <div className="flex gap-2 flex-col">
                           <h2 className="text-gray-500">Description</h2>
                           <Textarea
                              placeholder=""
                              defaultValue={listing?.description}
                              name="description"
                              onChange={handleChange}
                           />
                        </div>
                     </div>

                     <div>
                        <h2 className="font-lg text-gray-500 my-2">
                           Upload Property Images
                        </h2>
                        <FileUpload
                           setImages={(value) => setImages(value)}
                           imageList={listing.listingImages}
                        />
                     </div>

                     <div className="flex gap-7 justify-end">
                        <Button
                           variant="outline"
                           disabled={loading}
                           type="submit"
                           className="text-primary border-primary"
                        >
                           {loading ? (
                              <LoaderCircle className="animate-spin" />
                           ) : (
                              "Save"
                           )}
                        </Button>

                        {!listing.active && (
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                 <Button
                                    disabled={loading}
                                    type="button"
                                    className=""
                                 >
                                    {loading ? (
                                       <LoaderCircle className="animate-spin" />
                                    ) : (
                                       "Save & Publish"
                                    )}
                                 </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                 <AlertDialogHeader>
                                    <AlertDialogTitle>
                                       Are you ready to publish this property ?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                       Do you really want to publish this
                                       property listing ?
                                    </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                    <AlertDialogCancel>
                                       Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                       onClick={() => publishButtonHandler()}
                                    >
                                       {loading ? (
                                          <LoaderCircle className="animate-spin" />
                                       ) : (
                                          "Publish"
                                       )}
                                    </AlertDialogAction>
                                 </AlertDialogFooter>
                              </AlertDialogContent>
                           </AlertDialog>
                        )}
                     </div>
                  </div>
               </form>
            )}
         </Formik>
      </div>
   );
};

export default EditListing;
