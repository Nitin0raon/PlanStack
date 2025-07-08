import z from "zod";

export const projectSchema = z.object({
    name: z.string().min(1, "project name is required").max(100, "project name must be 100 character of less"),
    key: z.string().min(2, "project must be 2 characters").max(10, "project key must be less than 10 character"),
    description: z.string().max(10, "project key must be less than 10 character").optional(),
});

export const sprintSchema =z.object({
    name:z.string().min(1,"Sprint name is required"),
    startDate: z.date(),
    endDate: z.date(),
});