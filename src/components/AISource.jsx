import { useState, useEffect } from "react";
import '../App.css';
import { initializeWebGPU } from "../services/web_gpu";


export default function AISource({ onSourceSelect }) {
    const [selectedSource, setSelectedSource] = useState(null);

    useEffect(() => {
        // Initialize WebGPU when the component mounts
        initializeWebGPU()
            .then(() => {
                console.log('WebGPU initialized successfully');
            })
            .catch((error) => {
                console.error('Error initializing WebGPU:', error);
            });
    }, []);

    useEffect(() => {
        // Call the onSourceSelect callback whenever the selected source changes
        if (selectedSource) {
            onSourceSelect(selectedSource);
        }
    }, [selectedSource, onSourceSelect]);

    return (
        <div className="aisource-container">
            <div className="aisource-options">

                <select
                    className="aisource-select"
                    value={selectedSource || ''}
                    onChange={(e) => setSelectedSource(e.target.value)}
                >
                    <option value="" disabled>Select AI Source</option>
                    <option value="WebAI">Use Local AI (More Sustainable)</option>
                    <option value="AISearch">Use Remote AI (Faster)</option>
                </select>
                {/* <button
                    className={`aisource-option ${selectedSource === 'WebAI' ? 'selected' : ''}`}
                    onClick={() => {
                        setSelectedSource('WebAI');
                        onSourceSelect('WebAI');
                    }}
                >
                    Use Local AI
                </button> */}
            </div>
        </div>
    );
}