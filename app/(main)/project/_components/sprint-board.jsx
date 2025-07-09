"use client";
import React, { use, useEffect, useState } from 'react'
import SprintManager from './sprint-manager';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import IssueCreationDrawer from './create-issue';
import { getIssuesForSprint } from '@/actions/issues';
import useFetch from '@/hooks/use-fetch';
const SprintBoard = ({sprints,projectId,orgId}) => {

  const statuses = [
    { name: "Todo", key: "TODO" },
    { name: "In Progress", key: "IN_PROGRESS" },
    { name: "In Review", key: "IN_REVIEW" },
    { name: "Done", key: "DONE" },
  ];

  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr)=> spr.status === "ACTIVE") || sprints[0]
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  

  const{
    loading:issueLoading,
    error:issueError,
    fn:fetchIssues,
    data:issues,
    setData:setIssues,} = useFetch(getIssuesForSprint);


   console.log("Issues", issues);


   useEffect(() => {
    if(currentSprint.id) {
      fetchIssues(currentSprint.id);
    }
   },[currentSprint.id])
  const[filteredIssues, setFilteredIssues] = useState(issues);  
  const handleIssueCreated = () => {}
  const onDragEnd = () => {}

  const handleAddIssue = (status) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  }

  return (
    <div>
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
          {statuses.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  <h3 className="font-semibold mb-2 text-center">
                    {column.name}
                  </h3>
                  {/* {filteredIssues
                    ?.filter((issue) => issue.status === column.key)
                    .map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                        isDragDisabled={updateIssuesLoading}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <IssueCard
                              issue={issue}
                              onDelete={() => fetchIssues(currentSprint.id)}
                              onUpdate={(updated) =>
                                setIssues((issues) =>
                                  issues.map((issue) => {
                                    if (issue.id === updated.id) return updated;
                                    return issue;
                                  })
                                )
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    ))} */}
                  {provided.placeholder}
                  {column.key === "TODO" &&
                    currentSprint.status !== "COMPLETED" && (
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => handleAddIssue(column.key)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Issue
                      </Button>
                    )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {isDrawerOpen && selectedStatus && currentSprint?.id && (
        <IssueCreationDrawer
          isOpen={true}
          onClose={() => setIsDrawerOpen(false)}
          sprintId={currentSprint.id}
          status={selectedStatus}
          projectId={projectId}
          onIssueCreated={handleIssueCreated}
          orgId={orgId}
        />
      )}
    </div>
  );
}

export default SprintBoard;
