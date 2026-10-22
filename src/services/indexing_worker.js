import { semanticSearch } from './SemanticSearch.js';

self.onmessage = async (event) => {
  const { resources } = event.data;

  try {
    console.log("Indexing resources in worker...");

    // perform heavy lifting
    await semanticSearch.indexDocuments(resources);

    // Notify main thread that it is ready
    self.postMessage({ status: 'complete', message: 'Resources indexed successfully' });
  } catch (error) {
    console.error("Error indexing resources in worker:", error);
    self.postMessage({ status: 'error', message: error.message });
  }
}