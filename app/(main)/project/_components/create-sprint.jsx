"use client"
import { createSprint } from '@/actions/sprint';
import { sprintSchema } from '@/app/lib/validators';
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { addDays, format } from 'date-fns';
import { Calendar } from 'lucide-react';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';


const SprintCreationForm = ({
    projectTitle,
    projectKey,
    projectId,
    sprintKey,
}) => {

    const[showForm, setShowForm]= useState(false);

    const [dateRange,setDateRange]=useState({
        from:new Date(),
        to: addDays(new Date(),14),
    })

    const{register,handleSubmit,formState:{errors},control}=useForm({
        resolver:zodResolver(sprintSchema),
        defaultValues:{
            name:`${projectKey}-${sprintKey}`,
            startDate: dateRange.from,
            endDate: dateRange.to,
        },
    });
  return (
    <>
    <div className='flex justify-between'>
        <h1 className='text-5xl font-bold mb-8'>{projectTitle}</h1>
        <Button className="mt-2"
         onClick={()=> setShowForm(!showForm)}
         variant={showForm?"destructive":"default"}>
            {showForm ?"Cancel":"Create New Sprint"}
            </Button>
    </div>
    {showForm &&<Card className="pt-4 mb-4">
        <CardContent>
            <form className='flex gap-4 items-end'>
                <div className='text-amber-50 flex-1'>
                    <label htmlFor="name" className='text-black block text-sm font-medium mb-1'>Sprint Name</label>
                    <Input
                    id="name"
                    readOnly
                    className="bg-slate-950"
                    {...register("name")}
                    />
                    {errors.name &&(
                        <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="" className='block text-sm front-medium mb-1'>
                        Sprint Duration
                    </label>
                    <Controller
                    control={control}
                    name="dateRange"
                    render={({field})=>{
                        return(
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline"
                                className="w-full justify-start text-left font-norma ">
                                    <Calendar/>
                                    {dateRange.from && dateRange.to?(
                                        format(dateRange.from,"LLL dd, y")+" - "+format(dateRange.to,"LLL dd, y")
                                    ):(
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                
                            </PopoverContent>
                        </Popover>)
                    }}
                    />
                </div>
            </form>
        </CardContent>
    </Card> }
    </>
  )
}

export default SprintCreationForm