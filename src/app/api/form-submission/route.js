import { createWixClient, logError } from "@/utils";
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        const wixClient = await createWixClient();
        const id = process.env.WAITLIST_FORM_ID;
        const data = await req.json();

        const response = await wixClient.submissions.createSubmission({
            formId: id,
            status: "CONFIRMED",
            submissions: data,
        });
        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        logError("Error creating submission:", error)
        return NextResponse.json({ error: "Failed to create submission" }, { status: 500 });
    }
};