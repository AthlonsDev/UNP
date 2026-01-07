import { checkBadURL } from "../services/api";
import { useState, useEffect } from "react";
import '../App.css';

export default function LinkHealthCheck() {
  const [badURLs, setBadURLs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initial link check on component mount
    console.log("Performing initial link check...");
    // handleCheckLinks();
  }, []);

  const handleCheckLinks = async () => {
    setIsLoading(true);
    const result = await checkBadURL();
    setIsLoading(false);
    console.log("results from link check:", result);
    setBadURLs(result || []);
  };

  const toggleLinkLabel = () => {
        const authElement = document.getElementById('link-status-label');
    if (authElement) {
      authElement.classList.toggle('hidden');
    }
  };

  const icons = {
    'Success: ': '✅',
    'Warning: ': '⚠️',
    'Error: ': '❌',
  }

  return (
    <div>
        {/* {handleCheckLinks()} */}
        <button className="mt-4 px-6 py-2 font-bold border border-white text-white rounded-md hover:opacity-80 transition-opacity hover:cursor-pointer hover:bg-sky-900 bg-sky-500"
        disabled={isLoading}
        onClick={toggleLinkLabel}
        >
            {isLoading &&
                <div className="justify-center mt-4 flex">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-900">
                  </div>
                </div>
            }
            {!isLoading && badURLs.length > 0 && `${icons['Error: ']} ${badURLs.length}`}
            {!isLoading && badURLs.length === 0 && `${icons['Success: ']}`}
            <label id='link-status-label' className="absolute top-7 left-0 z-10 mt-8 px-6 py-2 text-white rounded-md hidden bg-red-600">
                {badURLs.length > 0 ? `${badURLs}` : 'All links are healthy!'}
            </label>
        </button>
    </div>

  )

}