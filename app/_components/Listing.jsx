import { Bath, BedDouble, Map, MapPin, Ruler, Search } from "lucide-react";
import Image from "next/image";
import GoogleAddressSearch from "./GoogleAddressSearch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import FilterSearch from "./FilterSearch";
import Link from "next/link";

const Listing = ({
   listing,
   handleSearchClick,
   searchAddress,
   isSearched,
   isLoading,
   setBedCount,
   setBathCount,
   setParkingCount,
   setHomeType,
   setCoordinates,
   toggleMapVisibility,
}) => {
   const [address, setAddress] = useState("");

   return (
      <div>
         <div className="p-3 flex gap-6">
            <GoogleAddressSearch
               setSelectedAddress={(v) => {
                  searchAddress(v);
                  setAddress(v);
               }}
               setCoordinates={setCoordinates}
            />

            <Button className="flex gap-2" onClick={handleSearchClick}>
               <Search className="w-4 h-4" />
               Search
            </Button>
         </div>

         <FilterSearch
            setBedCount={setBedCount}
            setBathCount={setBathCount}
            setParkingCount={setParkingCount}
            setHomeType={setHomeType}
         />

         <Button
            className="w-full my-4 flex gap-2 md:hidden"
            onClick={toggleMapVisibility}
         >
            <Map className="w-4 h-4" />
            Map
         </Button>

         {isSearched && address && (
            <div className="px-3 my-5">
               <h2 className="text-xl">
                  Found{" "}
                  <span className="text-primary font-bold">
                     {listing?.length}
                  </span>{" "}
                  Result in{" "}
                  <span className="text-primary font-bold">
                     {address?.label}
                  </span>
               </h2>
            </div>
         )}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {isLoading
               ? [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                    <div
                       key={index}
                       className="h-[230px] w-full bg-slate-200 animate-pulse rounded-lg"
                    ></div>
                 ))
               : listing?.length > 0 &&
                 listing.map((item, index) => (
                    <Link key={index} href={`/view-listing/${item.id}`}>
                       <div className="p-3 hover:border border-primary rounded-lg cursor-pointer ">
                          <Image
                             alt={item?.name}
                             src={item?.listingImages[0]?.url}
                             width={800}
                             height={150}
                             className="rounded-lg object-cover h-[170px]"
                          />
                          <div className="flex mt-2 flex-col gap-2">
                             <h2 className="font-bold text-xl">{item.name}</h2>
                             <h2 className="font-bold text-xl">
                                € {item.price}
                             </h2>
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
                          </div>
                       </div>
                    </Link>
                 ))}
         </div>
      </div>
   );
};

export default Listing;
