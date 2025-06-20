import { notificationService } from "@periface/server/services/store";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }
        console.log("Received ID:", id);
        const notificaciones = await notificationService.updateLeido(id);
        return NextResponse.json(notificaciones);
    } catch (error) {
        console.error("Error in GET request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

