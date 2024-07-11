"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

const EditListing = () => {
   return (
      <div className="px-10 md:px-36 my-10">
         <h2 className="font-bold text-2xl">
            Enter some more details about your listing
         </h2>
         <div className="p-8 rounded-lg shadow-md grid gap-7 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
               <div className="flex flex-col gap-2">
                  <h2 className="text-lg text-slate-500">Rent or Sell ?</h2>
                  <RadioGroup defaultValue="Sell">
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
                  <h2 className="text-lg text-gray-500">
                     Select Property Type
                  </h2>
                  <Select name="propertyType">
                     <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Property Type" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="Single Family House">
                           Single Family House
                        </SelectItem>
                        <SelectItem value="Town House">Town House</SelectItem>
                        <SelectItem value="Condo">Condo</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                  <div className="flex gap-2 flex-col">
                     <h2 className="text-gray-500"> Bedroom</h2>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default EditListing;
