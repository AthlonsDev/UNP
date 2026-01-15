import { checkBadURL } from "../services/api";
import { useState, useEffect } from "react";
import '../App.css';
import { updateLink } from "../services/api";

export default function LinkHealthCheck() {
  const [badURLs, setBadURLs] = useState([]);
  const [newLinks, setNewLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLinkInfo, setShowLinkInfo] = useState(false);
  const [showNewLinkInfo, setShowNewLinkInfo] = useState(false);


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
    setNewLinks([result || []]);

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
        // disabled={isLoading}
        onMouseEnter={() => setShowLinkInfo(true)} onMouseLeave={() => setShowLinkInfo(false)}
        onClick={() => { showNewLinkInfo ? setShowNewLinkInfo(false) : setShowNewLinkInfo(true); }}
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
        <div id='link-status-label' className={`absolute w-48 p-2 text-sm text-white bg-gray-800 border border-gray-600 rounded-md shadow-lg ${showLinkInfo ? '' : 'hidden'}`}>
          <label>
            {isLoading && 'Checking links...'}
            {!isLoading && badURLs.length === 0 && 'All links are healthy!'}
            {!isLoading && badURLs.length > 0 && `Found ${badURLs.length} broken links.`}
            {!isLoading && newLinks.length > 0 && 'New Links Found!'}
          </label>
        </div>
        <div className={`card-component card-enter border border-gray-300 w-150 absolute -top-8 left-25 ${showNewLinkInfo ? '' : 'hidden'}`}>
            <div className="p-4">
                <p>
                  <ul>
                   <li>
                        <a href="https://www.eea.europa.eu/data-and-maps/indicators/green-urban-areas-1/assessment">
                        "https://www.eea.europa.eu/data-and-maps/indicators/green-urban-areas-1/assessment" {icons['Error: ']},
                        </a>
                   </li>
                    <li>
                          <a href="https://www.unep.org/news-and-stories/story/making-cities-greener-and-healthier">
                          "https://www.unep.org/news-and-stories/story/making-cities-greener-and-healthier" {icons['Error: ']},
                          </a>
                    </li>
                    <li>
                          <a href="https://www.worldbank.org/en/news/feature/2019/09/18/greening-cities-to-fight-climate-change">
                          "https://www.worldbank.org/en/news/feature/2019/09/18/greening-cities-to-fight-climate-change" {icons['Success: ']},
                          </a>
                    </li>
                    <li>
                        <a href="https://www.iea.org/reports/energy-efficiency-2020">
                          "https://www.iea.org/reports/energy-efficiency-2020" {icons['Success: ']},
                        </a>
                    </li>
                    <li>
                          <a href="https://www.who.int/news-room/fact-sheets/detail/climate-change-and-health">
                          "https://www.who.int/news-room/fact-sheets/detail/climate-change-and-health" {icons['Success: ']},
                          </a>
                    </li>
                  </ul>
                </p>
            </div>

        </div>
    </div>
    </>
  )

}