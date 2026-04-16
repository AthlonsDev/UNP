import { checkBadURL } from "../services/api";
import { useState, useEffect } from "react";
import '../App.css';
import { updateLink, getNewLinks } from "../services/api";

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

    // add a UI section to show all the broken links
    // after clicking the button, the list gets updated with working links
    // this is just for show, the actual update happens automatically in the background and the user won't see it

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

  const handleUpdateLinks = async () => {
    setIsLoading(true);
    // console.log("Updating links with:", link);
    // const badLinks = ['https://www.eea.europa.eu/data-and-maps/indicators/green-urban-areas-1/assessment', 'https://www.unep.org/news-and-stories/story/making-cities-greener-and-healthier', 'https://www.worldbank.org/en/topic/urban-development/brief/urban-greening', 'https://www.c40.org/why-urban-greening/', 'https://www.theguardian.com/environment/2023/may/1…-greening-cities-nature-based-solutions-heatwaves', 'https://oppla.eu/visual-library', 'https://thinknature.eu/resources/', 'https://www.urbangreenup.eu/media-centre/infographics.kl', 'https://www.urbangreenbluegrids.com/resources/', 'https://www.nature.org/en-us/about-us/where-we-wor…hat-we-do/fresh-water/urban-green-infrastructure/', 'https://www.fs.usda.gov/learn/treesearch/treesearchpubs', 'https://www.epa.gov/green-infrastructure/what-green-infrastructure', 'https://www.nrpa.org/our-work/Three-Pillars/health-wellness/green-infrastructure/', 'https://www.conservation.org/projects/Pages/urban-greening.aspx'];
    const res = await getNewLinks();
    console.log("New links from API:", res);
    setLinkUpdated(true);
    setBadURLs(res || []);
    setIsLoading(false);
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
          // onClick={() => toggleLinkLabel()}
          onMouseEnter={() => setShowLinkInfo(true)}
          onMouseLeave={() => setShowLinkInfo(false)}
          onClick={() => handleUpdateLinks()}
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
        <div id="link-status-label" className={`mt-2 text-sm ${linkUpdated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} max-h-40 overflow-y-auto ${showLinkInfo ? '' : 'hidden'}`}>
            {badURLs.map((url, index) => (
                <div key={index} className="flex items-center">
                    <span className="mr-2">{linkUpdated ? icons['Success: '] : icons['Error: ']} {url}</span>
                </div>
            ))}
        </div>
    </div>
    </>
  )

}