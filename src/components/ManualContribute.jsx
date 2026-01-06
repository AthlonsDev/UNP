import { useState } from 'react'
import { fillForm } from '../services/api'
import '../App.css'
import { updateResources } from '../services/api'


export default function ManualContributeForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const loadingMessage = "Generating details using AI. This may take a moment..."

  const [info, setInfo] = useState({
    name: '',
    description: '',
    justification: '',
    category: '',
    subcategory: '',
    format: '',
    payment: '',
    unpSteps: '',
    languages: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url) {
      // alert("Please fill in both the URL and Name fields before submitting.")
      return
    }

    try {
      // await addContribution(url)
      setLoading(true)
      console.log("Submitting contribution with URL:", url);
      const response = await updateResources(info);
      if (response) {
        setLoading(false);
        setSuccess(true);
        setError(false);
      }
      setUrl('')
      setInfo({
        name: '',
        description: '',
        justification: '',
        category: '',
        subcategory: '',
        format: '',
        payment: '',
        unpSteps: '',
        languages: ''
      })
      
    } catch (error) {
      console.error('Error saving contribution:', error)
      alert('An error occurred. Please try again.')
      setLoading(false);
      setSuccess(false);
      setError(true);
    }
  }

  const handleAIGen = async (e) => {
    e.preventDefault()
    console.log("Generating details for URL:", url);
    // Call AI service to generate details based on URL
    setLoading(true);
    const generatedDetails = await fillForm(url);
    console.log("Generated details:", generatedDetails);
    setInfo(generatedDetails);
    setLoading(false);
  }

  return (
    <section className="card-component p-6 mb-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--primary-accent)' }}>
            Submit New Resource
        </h2>
        <h3>
            Know a useful resource that's missing? Share it with us by filling the form below.
            It will be reviewed and added to our collection!
        </h3>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="space-y-4">
            <input
              type="url"
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-half px-21 py-2 border border-gray-300  focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              required
            />
            <button
                type="submit"
                className="px-6 py-2 font-bold text-white  hover:opacity-80 transition-opacity hover:cursor-pointer hover:bg-sky-900 bg-sky-500"
                onClick={handleAIGen}
            >
                Generate Details
            </button>
          </div>
          {loading &&
            <div class="justify-center mt-4 flex">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900">
              </div>
            </div>
          }
          {loading &&
            <div className='w-half'>
              <p className="ml-4 text-gray-700">{loadingMessage}</p>
            </div>
          }
          <label className='font-bold'>Name</label>
          <div className="space-y-4">
            <input
              type="text"
              value={info.name} 
              onChange={(e) => setInfo({ ...info, name: e.target.value })}
              placeholder="Enter Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              required
            />
          </div>
          <label className='font-bold'>Description</label>
          <div className="space-y-4">
            <textarea name="name" id="" placeholder='Enter Name' className="field-sizing-content md:field-sizing-content w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              onChange={(e) => setInfo({ ...info, description: e.target.value })}
              rows={2}
              value={info.description}
              required
            >
              {/* {info.description} */}
            </textarea>
          </div>
          <label className='font-bold'>Justification</label>
          <div className="space-y-4">
            <textarea name="name" id="" placeholder='Enter Name' className="field-sizing-content md:field-sizing-content w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              onChange={(e) => setInfo({ ...info, justification: e.target.value })}
              rows={2}
              value={info.justification}
              required
            >
            </textarea>
          </div>
          <label className='font-bold'>Category</label>
          <div className="space-y-4">
            <input
              type="text"
              value={info.category} 
              onChange={(e) => setInfo({ ...info, category: e.target.value })}
              placeholder="Enter category"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              required
            />
          </div>
          <label className='font-bold'>Subcategory</label>
          <div className="space-y-4">
            <input
              type="text"
              value={info.subcategory} 
              onChange={(e) => setInfo({ ...info, subcategory: e.target.value })}
              placeholder="Enter subcategory"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              required
            />
          </div>
            <label className='font-bold'>Format</label>
            <div className="space-y-4">
            <input
              type="text"
              value={info.format} 
              onChange={(e) => setInfo({ ...info, format: e.target.value })}
              placeholder="Enter format"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              required
            />
          </div>
            <label className='font-bold'>Payment</label>
            <div className="space-y-4">
            <input
              type="text"
              value={info.payment} 
              onChange={(e) => setInfo({ ...info, payment: e.target.value })}
              placeholder="Enter payment"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              required
            />
          </div>
          <label className='font-bold'>UNP Steps</label>
            <div className="space-y-4">
            <input
              type="text"
              value={info.unpSteps} 
              onChange={(e) => setInfo({ ...info, unpSteps: e.target.value })}
              placeholder="Enter UNP Steps"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              required
            />
          </div>
            <div className="space-y-4">
            {/* set label to the left adding bold font */}
            <label className='font-bold'>Languages</label>
            <input
              type="text"
              value={info.languages} 
              onChange={(e) => setInfo({ ...info, languages: e.target.value })}
              placeholder="Enter Languages"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-accent focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-6 py-2 font-bold text-white rounded-md hover:opacity-80 transition-opacity hover:cursor-pointer hover:bg-sky-900 bg-sky-500"
          >
            Submit
          </button>
          {loading &&
            <div class="justify-center mt-4 flex">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900">
              </div>
            </div>
          }
          {success &&
            <p className="text-green-600 font-bold mt-4">Contribution submitted successfully!</p>
          }
          {error &&
            <p className="text-red-600 font-bold mt-4">An error occurred. Please try again.</p>
          }
        </form>
      </div>
    </section>
  )
}