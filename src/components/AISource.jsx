import { useState, useEffect } from "react";
import '../App.css';
import { initializeWebGPU, downloadModel } from "../services/web_gpu";


function DownloadModelProgress({ progress }) {
    return (
        <div className="download-progress">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            <span className="progress-text">{progress}%</span>
        </div>
    );
}

export default function AISource({ onSourceSelect }) {
    const [selectedSource, setSelectedSource] = useState(null);
    const [webGPUAvailable, setWebGPUAvailable] = useState(false);
    const [isWarningVisible, setIsWarningVisible] = useState(true);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [downloadStatus, setDownloadStatus] = useState("");

    const closeWarning = () => {
        setIsWarningVisible(false);
    };

    useEffect(() => {
        // Initialize WebGPU when the component mounts
        initializeWebGPU()
            .then(() => {
                console.log('WebGPU initialized successfully');
                setWebGPUAvailable(true);
            })
            .catch((error) => {
                console.error('Error initializing WebGPU:', error);
            });
    }, []);

    useEffect(() => {
        // Call the onSourceSelect callback whenever the selected source changes
        if (selectedSource) {
            if (selectedSource === 'WebAI') {
                setIsWarningVisible(true); // Show warning when WebAI is selected
            }
            onSourceSelect(selectedSource);
        }
    }, [selectedSource, onSourceSelect]);

    // handler to trigger the download
    const handleSourceChange = async (source) => {
        setSelectedSource(source);
        if (source === 'WebAI' && webGPUAvailable) {
            console.log("Starting model download for WebAI...");
            setDownloadProgress(0); // Reset progress
            try {
                await downloadModel((report) => {
                console.log("Model loading progress:", report);
                setDownloadProgress(report.progress*100);
                setDownloadStatus(report.text);
                });
            } catch (e) {
                console.error("Download failed", e);
            }
        }
        onSourceSelect(source);
    };

    return (
        <div className="aisource-container">
            <div className="aisource-options">

                <select
                    className="aisource-select"
                    value={selectedSource || ''}
                    onChange={(e) => handleSourceChange(e.target.value)}
                >
                    <option value="" disabled>Select AI Source</option>
                    <option value="WebAI">Use Local AI (More Sustainable)</option>
                    <option value="AISearch">Use Remote AI (Faster)</option>
                </select>
                {/* set progress bar for model download/init */}
                {webGPUAvailable && selectedSource === 'WebAI' && downloadProgress < 100 && (
                    <DownloadModelProgress progress={downloadProgress} />
                )}
                {isWarningVisible && selectedSource === 'WebAI' && (
                <div className="aisource-warning">
                    {selectedSource === 'WebAI' && (
                        <p className="text-sm text-yellow-600" onClick={() => closeWarning()}>
                            Warning! Local AI is an Experimental Feature. While more sustainable, it uses smaller AI models and may not provide the same level of accuracy as the remote AI. Please use with caution and verify results.
                        </p>
                    )}
                </div>
                )}
            </div>
        </div>
    );
}