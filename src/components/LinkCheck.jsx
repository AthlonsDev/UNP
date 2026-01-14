import { checkBadURL } from "../services/api";
import { useState, useEffect } from "react";
import '../App.css';
import { updateLink } from "../services/api";

export default function LinkHealthCheck() {
  const [badURLs, setBadURLs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [linkUpdated, setLinkUpdated] = useState(false);
  const [showLinkInfo, setShowLinkInfo] = useState(false);

  useEffect(() => {
    // Initial link check on component mount
    console.log("Performing initial link check...");
    handleCheckLinks();
    
  }, []);

  const handleCheckLinks = async () => {
    setIsLoading(true);

    const result = await checkBadURL();
    setIsLoading(false);
    console.log("results from link check:", result);
    setBadURLs(result || []); 
    setIsLoading(false);

    // setBadURLs(["https://example.com/broken-link1"]);
    // console.log("Bad URLs:", badURLs.length);
    // if (badURLs.length > 0){toggleLinkLabel();}
  };

  const toggleLinkLabel = () => {
    const authElement = document.getElementById('link-status-label');
    if (authElement) {
      authElement.classList.toggle('hidden');
    }
    // handleUpdateLinks("https://example.com/new-link");
  };

  const handleUpdateLinks = async (link) => {
    setIsLoading(true);
    console.log("Updating links with:", link);
    const result = await updateLink(link);
    setIsLoading(false);
    console.log("results from updating links:", result);
    // Optionally re-check links after update
    // await handleCheckLinks();
    setBadURLs([]);
    setLinkUpdated(true);

  };

  const icons = {
    'Success: ': '✅',
    'Warning: ': '⚠️',
    'Error: ': '❌',
    'loading': '⏳',
  }

  return (
    <>
    <div>
        {/* {handleCheckLinks()} */}
        <button className="px-6 py-2 font-bold border border-white text-white rounded-md hover:opacity-80 transition-opacity hover:cursor-pointer hover:bg-sky-900 bg-sky-500 shadow-sm"
        style={{ opacity: badURLs.length === 0 ? 0.3 : 1}}
        disabled={isLoading}
        onClick={() => handleUpdateLinks({badURLs})}
        >
            {isLoading &&
                <div className="justify-center flex">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-900">
                  </div>
                </div>
            }
            {!isLoading && badURLs.length > 0 && `${icons['Error: ']} ${badURLs.length}`}
            {!isLoading && badURLs.length === 0 && `${icons['Success: ']}`}

        </button>
    </div>
    </>
  )

}