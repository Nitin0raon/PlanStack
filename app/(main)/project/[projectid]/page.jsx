import { getProject } from '@/actions/project';
import { notFound } from 'next/navigation';
// import React from 'react'
import SprintCreationForm from '../_components/create-sprint';
import SprintBoard from '../_components/sprint-board';

const ProjectPage = async({params}) => {

  const {projectid}=params;

  const project = await getProject(projectid);

  if(!project){
    notFound();
  }
  return (
    <div className='text-amber-50 container mx-auto'>
      {/* Sprint creation */}
      <SprintCreationForm
      projectTitle={project.name}
      projectId={projectid}
      projectKey={project.key}
      sprintKey={project.sprints.length+1}
      className="bg-gray-800"
      />
      
      {project.sprints.length > 0? (
        <SprintBoard
        sprints={project.sprints}
        projectId={projectid}
        orgId={project.organizationId}
        />
      ):(
        <div>Create a Sprint from button</div>
      )}

    </div>
  )
}

export default ProjectPage