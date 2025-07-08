"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createProject(data){
    const {userId, orgId} = await auth();
    console.log("userid",userId);
    if(!userId){
        throw new Error("unauthorized");
    }
    if(!orgId){
        throw new Error("no organization selected");
    }

    try{
        const project= await db.project.create({
            data:{
                name:data.name,
                key:data.key,
                description:data.description,
                organizationId:orgId,
            },
        });
        return project;
    }
    catch(error){
        throw new Error("Error creating project:"+ error.message);
        
    }
}

export async function getProjects(orgId){
    const {userId}= await auth();
    if(!userId){
        throw new Error("unauthorized");
    }

    const user =await db.user.findUnique({
        where: {clerkUserId: userId},
    });

    if(!user){
        throw new Error("user not found");
    }

    const projects= await db.project.findMany({
        where:{organizationId:orgId},
        orderBy:{createdAt :"desc"},
    });
    return projects;
}

export async function deleteProject(projectId){
    const {userId, orgId, orgRole}= await auth();
    if(!userId || !orgId ){
        throw new Error("unauthorized");
    }

    if(orgRole !== "org:admin"){
        throw new Error ("only admins can delete projects");
    }

    const project = await db.project.findUnique({
        where:{id:projectId},
    });

    if(!project || project.organizationId !== orgId){
        throw new Error(
            "Project not found or you don't have permission to delete it"
        );
    }

    await db.project.delete({
        where:{id:projectId},
    })

    return {success:true};
}

export async function getProject(projectId){

    if(!projectId){
        throw new Error("Missing projectId")
    }
    
    const {userId, orgId}= await auth();
    if(!userId || !orgId ){
        throw new Error("unauthorized");
    }

    const user = await db.user.findUnique({
        where:{clerkUserId:userId},
    });

    if(!user){
        throw new Error(
            "User not found"
        );
    }

    const project = await db.project.findUnique({
        where:{id:projectId},
        include:{
            sprints:{
                orderBy:{createdAt:"desc"},
            },
        },
    })
    if(!project){
        throw new Error("Project not found");
    }

    if(project.organizationId !== orgId){
        return null;
    }
    return project;
}