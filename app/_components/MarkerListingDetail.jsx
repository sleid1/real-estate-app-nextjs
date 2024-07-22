import { Button } from "@/components/ui/button";
import { Bath, BedDouble, MapPin, Ruler, X } from "lucide-react";
import Image from "next/image";

const MarkerListingDetail = ({ item, closeHandler }) => {
   return (
      <div>
         <div className="relative cursor-pointer rounded-lg w-min h-min">
            <X
               className="bg-primary text-white w-7 h-7 absolute right-0 top-0"
               onClick={() => closeHandler()}
            />
            <Image
               alt={item?.name}
               src={item?.listingImages[0]?.url}
               width={800}
               height={150}
               className="rounded-lg object-cover h-[120px] w-full"
            />
            <div className="bg-white p-2 flex mt-2 flex-col gap-2">
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
               <Button size="sm">View Detail</Button>
            </div>
         </div>
      </div>
   );
};

export default MarkerListingDetail;
