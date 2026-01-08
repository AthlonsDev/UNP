import React from "react";
import { useState } from "react";

export default function HintCard() {

    return (
        <div className="hint-card card-component card-enter bg-white border border-gray-300 rounded-md mb-6">
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--primary-accent)' }}>
                    💡 Hint:
                </h3>
                <p>
                    You can contribute resources manually by clicking the "+" button at the top right corner of the page once logged in.
                </p>
            </div>
        </div>
    );


}