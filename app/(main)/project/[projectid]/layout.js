import React, { Suspense } from 'react'

const ProjectLayout = async({children}) => {
  return (
    <div className='mx-auto '>
        <Suspense fallback={<span className='text-amber-50'>Loading Projects....</span>}>
            {children}</Suspense>
        
        </div>
  )
}

export default ProjectLayout