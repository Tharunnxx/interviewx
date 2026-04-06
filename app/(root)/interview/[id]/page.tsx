import Agent from "@/components/Agent";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params; // ✅ FIX

    return (
        <>
            <h3>Interview</h3>

            <Agent
                userName="You"
                mode="interview"
                interviewId={id} // ✅ CORRECT ID
            />
        </>
    );
};

export default Page;