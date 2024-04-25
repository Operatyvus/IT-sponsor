import prisma from "@/app/utils/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        const data = await req.json();
        const {
            issue_id,
            user_id
        }: {
            issue_id: number,
            user_id: number
        } = data;
        try {
            await prisma.$transaction(async (tx) =>{
                const gets_assigned = await tx.gets_assigned.create({
                    data: {
                        fk_usersid: user_id as number,
                        fk_issuesid: issue_id as number
                    },
                });
                const applies = await prisma.applies.delete({
                    where: {
                        fk_usersid_fk_issuesid: { fk_issuesid: issue_id, fk_usersid: user_id } }
                    },
                );
            });
            return new NextResponse(JSON.stringify({ message: "Gets_assigned created successfully" }), { status: 201 });
        } catch (error) {

            return new NextResponse(JSON.stringify({ message: "Error creating gets_assigned", error: error.message }), { status: 500 });
        }
    } else {
        return new NextResponse(JSON.stringify({ message: `Method ${req.method} Not Allowed` }), { status: 405 });
    }
}