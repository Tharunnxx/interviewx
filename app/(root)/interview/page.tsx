import React from "react";
import Agent from "@/components/Agent";

const Page = () => {
    return (
        <>
            <h3>Start Interview</h3>

            <Agent userName="You" mode="interview" />
        </>
    );
};

export default Page;