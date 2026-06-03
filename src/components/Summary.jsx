import { React, useState, useEffect } from "react";
import { sumRes } from "../services/api";
import { use } from "react";

export default function Summary({ link }) {
    const [summaryData, setSummaryData] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    
    const fetchSummary = async () => {
        setLoading(true);
        try {
            const data = await sumRes(link);
            console.log("Summary data from API:", data);
            setSummaryData(data);
        } catch (error) {
            console.error("Error fetching summary:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSummary = () => {
        setOpen(!open);
        console.log("Summary open state:", !open);
        console.log("Summary data:", summaryData);
        if (!open && !summaryData) {
            fetchSummary();
        }

    }

    return (
        <div className={`summary-container p-4 bg-gray-100 rounded-lg shadow-md text-center summary-content ${!open ? 'h-10' : 'h-auto'}`}
        onClick={handleSummary}>
            <div className="">
                <h2>Summary</h2>
                {summaryData ? (
                    <div className={`mt-2 text-left text-sm text-gray-700 line-clamp-3 ${open ? 'block' : 'hidden'}`}>
                        <p>{summaryData}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-x-2 text-white p-4 rounded-lg">
                        <svg className="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
                            <path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,1,0,4.46,9.5a8,8,0,0,1,6.66-6.61A1.59,1.59,0,1,0,10.14,1.16Z"/>
                        </svg>
                        <p>Loading...</p>
                    </div>
                )}
            </div>
        </div>
    );
}