import { checkBadURL, getBadLinks } from "../services/api";
import { useState, useEffect } from "react";
import '../App.css';
import { updateLink, getNewLinks, replaceLink } from "../services/api";


// This component is just for demo purposes, but it show the process of spotting and replacing dead links
// Actual logic will be done in the background, except the user reporting.
export default function LinkHealthCheck() {
  const [badURLs, setBadURLs] = useState([]);
  const [unreachURLs, setUnreachURLs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [linkUpdated, setLinkUpdated] = useState(false);
  const [showLinkInfo, setShowLinkInfo] = useState(false);
  const [showDeadLinks, setShowDeadLinks] = useState(false);
  const [showUnreachLinks, setShowUnreachLinks] = useState(false);
  const badLinksArr = [];
  const unreachableLinksArr = [];



  useEffect(() => {
    // Initial link check on component mount
    console.log("Performing initial link check...");
    const handleCheckLinks = async () => {
        setIsLoading(true);
        const result = await getBadLinks();
        console.log("Bad links from API:", result);
        setIsLoading(false);
        for ( const [key, value] of Object.entries(result.dead || {})) {
            badLinksArr.push({ column: key, url: value });
            // console.log(`bad link: ${key} in column: ${value}`);
        }
        for ( const [key, value] of Object.entries(result.unreachable || {})) {
            unreachableLinksArr.push({ column: key, url: value });
            // console.log(`unreachable link: ${key} in column: ${value}`);
        }

        setBadURLs(badLinksArr);
        setUnreachURLs(unreachableLinksArr);
        setIsLoading(false);
      };
    handleCheckLinks();

  }, []);

  

  const toggleLinkLabel = () => {
    const authElement = document.getElementById('link-status-label');
    if (authElement) {
      authElement.classList.toggle('hidden');
    }
    // handleUpdateLinks("https://example.com/new-link");
  };

  const handleUpdateLinks = async (url) => {
    setIsLoading(true);
    const res = await getNewLinks();
    console.log("New links from API:", res);
    setLinkUpdated(true);
    setBadURLs(res || []);
    setIsLoading(false);
  };

  const handleReplaceLink = async (oldUrl) => {
    setIsLoading(true);
    const res = await replaceLink(oldUrl);
    // delete old URL from badURLs and unreachURLs
    setBadURLs(prev => prev.filter(item => item.url !== oldUrl));
    setIsLoading(false);
    // Optionally show a success message or update the UI to reflect the change
    alert(`Replaced ${oldUrl} with ${res}`);
  };

  const icons = {
    'Success: ': '✅',
    'Warning: ': '⚠️',
    'Error: ': '❌',
    'loading': '⏳',
    'Warning': '⚠️',
  }

  return (
    <>
    <div>
        {/* {handleCheckLinks()} */}
        <button className="px-6 py-2 font-bold border border-white text-white rounded-md hover:opacity-80 transition-opacity hover:cursor-pointer hover:bg-sky-900 bg-sky-500 shadow-sm"
          style={{ opacity: badURLs.length === 0 ? 0.3 : 1}}
          disabled={isLoading}
          // onClick={() => toggleLinkLabel()}
          // onMouseEnter={() => setShowDeadLinks(!showDeadLinks)}
          // onMouseLeave={() => setShowLinkInfo(false)}
          onClick={() => setShowDeadLinks(!showDeadLinks)}
        >
          {isLoading &&
              <div className="justify-center flex">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-900">
                </div>
              </div>
          }
          
          {!isLoading && !linkUpdated && `${icons['Error: ']} ${badURLs.length}`}
          {!isLoading && linkUpdated && `${icons['Success: ']}`}

        </button>
        <button className="px-6 py-2 ml-2 font-bold border border-white text-white rounded-md hover:opacity-80 transition-opacity hover:cursor-pointer hover:bg-sky-900 bg-sky-500 shadow-sm"
          style={{ opacity: badURLs.length === 0 ? 0.3 : 1}}
          disabled={isLoading}
          // onClick={() => toggleLinkLabel()}
          // onMouseEnter={() => setShowUnreachLinks(!showUnreachLinks)}
          // onMouseLeave={() => setShowUnreachLinks(false)}
          onClick={() => setShowUnreachLinks(!showUnreachLinks)}
        >
            {isLoading &&
                <div className="justify-center flex">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-900">
                  </div>
                </div>
            }
            {!isLoading && !linkUpdated && `${icons['Warning: ']} ${unreachURLs.length}`}
            {!isLoading && linkUpdated && `${icons['Success: ']}`}

        </button>
        <div id="link-status-label" className={`mt-2 text-sm ${linkUpdated ? 'bg-green-100 text-green-800' : 'bg-white text-red-800'} max-h-40 max-w-80 overflow-y-auto`}>
            {/* {badURLs.map((url, index) => (
                <div key={index} className="flex items-center">
                    <p className="mr-2">{linkUpdated ? icons['Success: '] : icons['Error: ']} {url}</p>
                </div>
            ))} */}
            {showDeadLinks && (
              <div>
                <p className="font-bold">Bad URLs:</p>
                {badURLs.length > 0 ? badURLs.map((item, index) => (
                  <div key={index} className="items-start">
                      {/* <p className="mr-2">{item.column} ({item.data_type})</p> */}
                      <button className="text-left text-sm text-red-600 hover:underline hover:cursor-pointer"
                        onClick={() => handleReplaceLink(item.url)}>
                        ({item.url})
                      </button>
                  </div>
                )) : <p>No bad URLs found.</p>}
              </div>
            )}
            {showUnreachLinks && (
              <div>
                <p className="font-bold">Unreachable URLs:</p>
                {unreachURLs.length > 0 ? unreachURLs.map((item, index) => (
                  <div key={index} className="items-start">
                      {/* <p className="mr-2">{item.column} ({item.data_type})</p> */}
                      <button className="text-left text-sm text-red-600 hover:underline hover:cursor-pointer"
                        onClick={() => handleReplaceLink(item.url)}>
                        ({item.url})
                      </button>
                  </div>
                )) : <p>No unreachable URLs found.</p>}
              </div>
            )}
        </div>
    </div>
    </>
  )

}