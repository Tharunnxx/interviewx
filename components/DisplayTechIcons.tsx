"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type TechIconProps = {
    techStack: string;
};

const DisplayTechIcons = ({ techStack }: TechIconProps) => {

    let techArray: string[] = [];

    // ✅ handle string
    if (typeof techStack === "string") {
        techArray = techStack.split(",").map((t) => t.trim());
    }

    // ✅ handle array
    else if (Array.isArray(techStack)) {
        techArray = techStack;
    }

    // ❌ fallback
    else {
        techArray = [];
    }

    return (
        <div className="flex flex-row">
            {techArray.slice(0, 3).map((tech, index) => (
                <div
                    key={tech}
                    className={cn(
                        "relative group bg-dark-300 rounded-full p-2 flex-center",
                        index >= 1 && "-ml-3"
                    )}
                >
                    <span className="tech-tooltip">{tech}</span>
                    <img src={`/tech/${tech}.png`} className="size-5" />
                </div>
            ))}
        </div>
    );
};

export default DisplayTechIcons;