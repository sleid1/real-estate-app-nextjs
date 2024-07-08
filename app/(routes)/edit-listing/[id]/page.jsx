"use client";

const EditListing = () => {
   return (
      <div className="px-10 md:px-36 my-10">
         <h2 className="font-bold text-2xl">
            Enter some more details about your listing
         </h2>
         <div className="p-8 rounded.lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3">
               <div>
                  <h2>Rent or Sell ?</h2>
               </div>
            </div>
         </div>
      </div>
   );
};

export default EditListing;
