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
        <button className="px-6 py-2 font-bold border border-white text-white rounded-md hover:opacity-80 transition-opacity hover:cursor-pointer hover:bg-sky-900 bg-sky-500 shadow-sm"
        style={{ opacity: badURLs.length === 0 ? 0.3 : 1}}
        disabled={isLoading}
        onClick={toggleLinkLabel}
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
        {badURLs.length > 0 &&
          <label id='link-status-label' className="px-6 py-2 text-white rounded-md hidden bg-red-600">
              {badURLs.length > 0 ? `${badURLs}` : ''}
          </label>
        }
    </div>

  )

}