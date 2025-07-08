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

export async function updateSprintStatus(sprintId, newStatus){
    const {userId, orgId} = await auth();

    if(!userId || !orgId){
        throw new Error("unauthorized");
    }

    try{
        const sprint = await db.sprint.findUnique({
        where: { id: sprintId },
        include: { project: true },
    });

       if(!sprint || sprint.project.organizationId !== orgId){
        throw new Error("Sprint not found or unauthorized access");
    }

    const now=new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    if(newStatus === "ACTIVE" && (now < startDate || now > endDate)){
        throw new Error("Sprint cannot be started outside its date range");
    }
    if(newStatus === "COMPLETED" && (now < startDate || now > endDate)){
        throw new Error("Sprint cannot be completed outside its date range");
    }
    const updatedSprint = await db.sprint.update({
        where: { id: sprintId },
        data: { status: newStatus },
    });

    return {success:true, sprint: updatedSprint};

}

    catch(error){
        throw new Error(error.message);
    }
}