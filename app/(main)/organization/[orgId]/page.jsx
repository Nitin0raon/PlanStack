import { getOrganization } from '@/actions/organization';
import OrgSwitcher from '@/components/org-switcher';
import React from 'react';
import ProjectList from './_components/project.list';
// import { redirect } from 'next/navigation'; // Only if you want to redirect instead of rendering a message

const Organization = async ({ params }) => {
  const { orgId } = await params;
  const organization = await getOrganization(orgId);
  // console.log("✅ user id:", organization); for checking output

  // --- Handle the case where getOrganization returns null ---
  if (!organization) {
    // Option 1: Render a message
    return (
      <div className="text-red-500 text-center py-10">
        <p>Organization not found or you do not have permission to view it.</p>
        {/* You might add a link here, e.g., <Link href="/dashboard">Go to Dashboard</Link> */}
      </div>
    );

    // Option 2: Redirect to another page (uncomment import at top if using this)
    // console.log("Organization not found or access denied. Redirecting.");
    // redirect('/'); // Redirect to home or a dedicated access denied page
  }

  // --- If organization is found, render its details ---
  return (
    <div>
      <div className='text-amber-50'>
        <div className='mb-4 flex flex-col sm:flex-row justify-between items-start'>
          <h1 className='text-5xl font-bold pb-2 '>{organization.name}'s Project</h1> {/* This will now be safe because organization is not null */}
        <OrgSwitcher/>
        </div>
        <div>
          <ProjectList orgId={organization.id}/>
        </div>
        <div>
          Show user assigned and reported issue here
        </div>
      </div>
    </div>
  );
};

export default Organization;