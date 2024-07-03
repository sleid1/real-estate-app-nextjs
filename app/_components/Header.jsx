"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
   const path = usePathname();

   useEffect(() => {
      console.log(path);
   }, []);

   return (
      <div className="p-6 px-10 flex justify-between shadow-sm fixed top-0 w-full z-10 bg-white">
         <div className="flex gap-12 items-center">
            <Image src={"/logo.svg"} width={150} height={150} alt="logo" />
            <ul className=" hidden md:flex gap-10">
               <Link href={"/"}>
                  <li
                     className={`hover:text-primary font-medium text-sm cursor-pointer ${
                        path == "/" && "text-primary"
                     }`}
                  >
                     For Sale
                  </li>
               </Link>

               <li className="hover:text-primary font-medium text-sm cursor-pointer">
                  For Rent
               </li>
               <li className="hover:text-primary font-medium text-sm cursor-pointer">
                  Agent Finder
               </li>
            </ul>
         </div>
         <div className="flex gap-2">
            <Button className="flex gap-2">
               <Plus className="h-5 w-5" />
               Post your Property
            </Button>
            <Button variant="outline">Login</Button>
         </div>
      </div>
   );
};

export default Header;
