"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema } from "@/app/lib/validators";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { createProject } from "@/actions/project";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateProjectPage = () => {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors, } } = useForm({
        resolver: zodResolver(projectSchema),
    })
    const { data: project, loading, error, fn: createProjectFn, } = useFetch(createProject)

    useEffect(() => {
        if (project) {
            toast.success("submit successfully");
            router.push(`/project/${project.id}`);
        }
    }, [loading]);
    const onSubmit = async (data) => {
        createProjectFn(data);
    }
    return (
        <div className='text-amber-50'>
            <h1 className=" text-6xl text-center font-bold mb-8 ">Create New Project</h1>
            <div>
                <form className="flex flex-col space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Input id='name'
                            className=" bg-slate-950" placeholder="project name"
                            {...register("name")}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <Input id='key'
                            className=" bg-slate-950" placeholder="project key {Ex: JDHS"
                            {...register("key")}
                        />
                        {errors.key && <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>}
                    </div>
                    <div>
                        <Textarea
                            id='description'
                            className="bg-slate-950 h-32 resize-y"
                            placeholder="Project Description"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    <Button disabled={loading} type="submit" size="lg" className="bg-blue-600">C
                        {loading ? "Creating..." : "create Project"}</Button>
                    {error && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </form>
            </div>

        </div>
    )
}

export default CreateProjectPage