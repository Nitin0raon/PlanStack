"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createSprint(projectId, data){
    const{userId, orgId}= await auth();

    if(!userId || !orgId){
        throw new Error("unauthorized");
    }

    const project = await db.project.findUnique({
            where:{id:projectId},
        });

    if(!project || project.organizationId !== orgId){
        throw new Error("project not found");
    }

    const sprint = await db.sprint.create({
        data:{
            name:data.name,
            startDate:data.startDate,
            endDate:data.endDate,
            status:"PLANNED",
            projectId,
        },
    });
    return sprint;
}