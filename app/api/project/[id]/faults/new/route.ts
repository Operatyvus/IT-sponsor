import prisma from "@/app/utils/prisma/client";
import { faults_severity, faults_status } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        const data = await req.json();
        const {
            title,
            description,
            severity,
            status,
            id_project,
            user_id
        }: {
            title: string,
            description: string,
            severity: string,
            status: string,
            id_project: number,
            user_id: number
        } = data;

        try {
            const fault = await prisma.faults.create({
                data: {
                    id: undefined, // Add the 'id' property
                    projects: undefined, // Add the 'projects' property
                    users: undefined, // Add the 'users' property
                    title,
                    created_at: new Date(),
                    description,
                    severity: severity as faults_severity, // Explicitly type the 'severity' property
                    status: status as faults_status, // Explicitly type the 'status' property
                    fk_projectsid: id_project as number,
                    fk_usersid: user_id,
                },
            });
            return new NextResponse(JSON.stringify({ message: "Fault created successfully", fault }), { status: 201 });
        } catch (error: any) {
            return new NextResponse(JSON.stringify({ message: "Error creating fault", error: error.message }), { status: 500 });
        }
    } else {
        return new NextResponse(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), { status: 405 });
    }
}