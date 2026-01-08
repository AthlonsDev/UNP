import React from "react";
import { useState } from "react";

export function HintCard() {

    return (
        <div className="card-component card-enter border border-gray-300">
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--primary-accent)' }}>
                    💡 Hint:
                </h3>
                <ul>
                    <li className="mb-1">1. Commitment </li>
                    <li className="mb-1">2. Governance</li>
                    <li className="mb-1">3. Vision</li>
                    <li className="mb-1">4. Stakeholders</li>
                    <li className="mb-1">5. Analysis</li>
                    <li className="mb-1">6. Co-Develop</li>
                    <li className="mb-1">7. Action Plan</li>
                    <li className="mb-1">8. Implement</li>
                    <li className="mb-1">9. Monitor</li>
                    <li className="mb-1">10. Review</li>
                </ul>
            </div>
        </div>
    );
}