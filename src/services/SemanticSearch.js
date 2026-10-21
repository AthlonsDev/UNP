
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
        if (!documents || documents.length === 0) return;
        await this.init();

        // Process documents in smaller chunks to prevent blocking the main thread
        const batchSize = 10;
        const total = documents.length;
        const indexed = [];

        for (let i = 0; i < total; i += batchSize) {
            const batch = documents.slice(i, i + batchSize);

            const batchResults = await Promise.all(
                batch.map(async (doc) => {
                    // Handle both string documents and resource objects
                    const textToEmbed = typeof doc === 'string'
                        ? doc
                        : [
                            doc.name,
                            doc.description,
                            doc.subcategory,
                            doc.summaryBullets?.for,
                            doc.summaryBullets?.outcome,
                            doc.summaryBullets?.user
                          ].filter(Boolean).join(' ');

                    const output = await this.embedder(textToEmbed, { pooling: 'mean', normalize: true });
                    const vector = Array.from(output.data);

                    return {
                        text: typeof doc === 'string' ? doc : doc, // Keep original object if it was one
                        vector: vector
                    };
                })
            );

            indexed.push(...batchResults);

            // Yield control back to the browser to allow UI updates/renders
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        this.indexedDocuments = indexed;
        console.log(`Indexing complete. Indexed ${this.indexedDocuments.length} documents.`);
    }

    async search(query, topK = 5) {
        await this.init();

        // 1. Embed the query (normalize=true makes cosine similarity just a dot product)
        const queryOutput = await this.embedder(query, { pooling: 'mean', normalize: true });
        const queryVector = Array.from(queryOutput.data);

        // 2. Calculate similarity (Dot product since vectors are normalized)
        const results = this.indexedDocuments.map(doc => {
            // Safety check: ensure vectors are the same length
            if (!doc.vector || doc.vector.length !== queryVector.length) {
                return { document: doc.text, score: -1 };
            }
            const similarity = queryVector.reduce((sum, val, i) => sum + val * doc.vector[i], 0);
            return { document: doc.text, score: similarity };
        });

        // 3. Sort by highest score and return top K
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);
    }
    
}

// Export as a singleton
export const semanticSearch = new SemanticSearchEngine();
