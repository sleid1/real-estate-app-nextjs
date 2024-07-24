import { Button } from "@/components/ui/button";
import { CheckCircleIcon, ShareIcon } from "lucide-react";
import { useState, useCallback } from "react";

const ShareButton = () => {
   const [copied, setCopied] = useState(false); // State to track if URL is copied

   const handleCopyUrl = useCallback(() => {
      const url = window.location.href;

      if (navigator.clipboard) {
         navigator.clipboard
            .writeText(url)
            .then(() => {
               setCopied(true); // Update state when URL is copied
               setTimeout(() => {
                  setCopied(false); // Reset state after 2 seconds (or any duration you prefer)
               }, 2000);
            })
            .catch((err) => {
               console.error("Failed to copy URL: ", err);
            });
      } else {
         console.error("Clipboard API not supported");
      }
   }, []);

   return (
      <Button
         variant={copied ? "success" : "default"}
         className="flex gap-2"
         onClick={handleCopyUrl}
      >
         {copied ? (
            <>
               <CheckCircleIcon /> Successfully Copied !
            </>
         ) : (
            <>
               <ShareIcon /> Share
            </>
         )}
      </Button>
   );
};

export default ShareButton;
