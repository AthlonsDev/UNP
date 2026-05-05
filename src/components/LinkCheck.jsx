import { checkBadURL, getBadLinks } from "../services/api";
import { useState, useEffect } from "react";
import '../App.css';
import { updateLink, getNewLinks } from "../services/api";

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
            badLinksArr.push({ column: key, data_type: value });
            // console.log(`bad link: ${key} in column: ${value}`);
        }
        for ( const [key, value] of Object.entries(result.unreachable || {})) {
            unreachableLinksArr.push({ column: key, data_type: value });
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
          onMouseEnter={() => setShowDeadLinks(!showDeadLinks)}
          // onMouseLeave={() => setShowLinkInfo(false)}
          // onClick={() => handleUpdateLinks()}
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
          onMouseEnter={() => setShowUnreachLinks(!showUnreachLinks)}
          // onMouseLeave={() => setShowUnreachLinks(false)}
          // onClick={() => handleUpdateLinks()}
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
        <div id="link-status-label" className={`mt-2 text-sm ${linkUpdated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} max-h-40 overflow-y-auto`}>
            {/* {badURLs.map((url, index) => (
                <div key={index} className="flex items-center">
                    <p className="mr-2">{linkUpdated ? icons['Success: '] : icons['Error: ']} {url}</p>
                </div>
            ))} */}
            {showDeadLinks && (
              <div>
                <p className="font-bold">Bad URLs:</p>
                {badURLs.length > 0 ? badURLs.map((item, index) => (
                  <div key={index} className="flex items-center">
                      <p className="mr-2">{item.column} ({item.data_type})</p>
                  </div>
                )) : <p>No bad URLs found.</p>}
              </div>
            )}
            {showUnreachLinks && (
              <div>
                <p className="font-bold">Unreachable URLs:</p>
                {unreachURLs.length > 0 ? unreachURLs.map((item, index) => (
                  <div key={index} className="flex items-center">
                      <p className="mr-2">{item.column} ({item.data_type})</p>
                  </div>
                )) : <p>No unreachable URLs found.</p>}
              </div>
            )}
        </div>
    </div>
    </>
  )

}