"use client";
import { updateSprintStatus } from '@/actions/sprint';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useFetch from '@/hooks/use-fetch';
import { format, formatDistance, formatDistanceToNow, isAfter, isBefore, set } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { get } from 'react-hook-form';

const SprintManager = ({sprint, setSprint, sprints, projectId}) => {
  
  const[status, setStatus]= useState(sprint.status);

  const startDate =new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);
    const now = new Date();

    const canStart=
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";

    const canEnd = status === "ACTIVE";

    const{
        fn:updateStatus,
        loading,
        data:updatedStatus,
    }=useFetch(updateSprintStatus);

    const handleStatusChange =  async(newStatus) => {
        updateStatus(sprint.id, newStatus);
    }
    useEffect(() => {
  if (updatedStatus && updatedStatus.success) {
    setStatus(updatedStatus.sprint.status);
    setSprint({
      ...sprint,
      status: updatedStatus.sprint.status,
    });
  }
}, [updatedStatus]);


    const handleSprintChange =(value)=>{
        const selectedSprint = sprints.find(s => s.id === value);
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
    }

    const getStatusText = () => {
        if (status === "PLANNED" && isBefore(now, startDate)) {
            return `Sprint starts in ${formatDistance(startDate, now)}`;
        } else if (status === "ACTIVE" && isAfter(now,endDate)) {
            return `Overdue by ${formatDistanceToNow(endDate)}`;
        } else if (status === "COMPLETED") {
            return "Sprint has been completed.";
        } else {
            return null;
        }
    }
    return (<>
    <div className='flex justify-between items-center gap-4'>
        <Select value={sprint.id} onValueChange={handleSprintChange} 
            >
            <SelectTrigger className="bg-amber-50 self-start text-black">
                <SelectValue placeholder="Select Sprint"/>
            </SelectTrigger>
            <SelectContent>
                {sprints.map((sprint)=>{
                    return (
                        <SelectItem key={sprint.id} value={sprint.id}>
                            {sprint.name} ({format(sprint.startDate, "MMM d, yyyy")}) to{" "}
                            {format(sprint.endDate,"MMM d, yyyy")}
                        </SelectItem>
                    )
                })}
            </SelectContent>
        </Select>

        {canStart && <Button className="bg-green-900 text-white"
        onClick={()=>handleStatusChange("ACTIVE")}
        disabled={loading}
        >Start Sprint</Button>}
        {canEnd && <Button variant='destructive'
        onClick={()=>handleStatusChange("COMPLETED")}
        disabled={loading}
        >End Sprint</Button>}
    </div>
    {getStatusText() && <Badge className="mt-4 ml-1 self-start">{getStatusText()}</Badge>}
    </>
  )
}

export default SprintManager