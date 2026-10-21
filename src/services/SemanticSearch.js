
import { pipeline } from '@huggingface/transformers';

class SemanticSearchEngine {

    constructor() {
        this.embedder = null;
        this.modelName = 'sentence-transformers/all-MiniLM-L6-v2';
        this.indexedDocuments = []; // Stores { text, vector }
    }

    async init() {
        if (!this.embedder) {
            // Load model once and cache it
            const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            this.embedder = embedder;
        }
    }

    // Call this once when your app loads or resources change
    async indexDocuments(documents) {
        await this.init();

        // Process documents in batches to avoid blocking the UI
        this.indexedDocuments = await Promise.all(
            documents.map(async (doc) => {
                const output = await this.embedder(doc, { pooling: 'mean', normalize: true });
                return {
                    text: doc,
                    vector: Array.from(output.data)
                };
            })
        );
        console.log("Indexing complete.", this.indexedDocuments);
    }

    async search(query, topK = 5) {
        await this.init();

        // 1. Embed the query (normalize=true makes cosine similarity just a dot product)
        const queryOutput = await this.embedder(query, { pooling: 'mean', normalize: true });
        const queryVector = Array.from(queryOutput.data);

        // 2. Calculate similarity (Dot product since vectors are normalized)
        const results = this.indexedDocuments.map(doc => {
            const similarity = queryVector.reduce((sum, val, i) => sum + val * doc.vector[i], 0);
            console.log('documents reported: ', doc.text)
            return { document: doc.text, score: similarity };
        });
        console.log("Search results before sorting:", results);
        // 3. Sort by highest score and return top K
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }
    
}

// Export as a singleton
export const semanticSearch = new SemanticSearchEngine();
