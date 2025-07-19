// import { getOrganization } from '@/actions/organization';
// import OrgSwitcher from '@/components/org-switcher';
// import ProjectList from './_components/project.list';

// const Organization = async ({ params }) => {
//   const { orgId } = params; // ✅ No await here
//   const organization = await getOrganization(orgId);

//   console.log("✅ organization object:", organization.name);

//   if (!organization) {
//     return (
//       <div className="text-red-500 text-center py-10">
//         <p>Organization not found or you do not have permission to view it.</p>
//       </div>
//     );
//   }

//   return (
//     <div className='text-amber-50'>
//       <div className='mb-4 flex flex-col sm:flex-row justify-between items-start'>
//         <h1 className='text-5xl font-bold pb-2 '>{organization.name ?? 'Organization'}'s Project</h1>
//         <OrgSwitcher />
//       </div>
//       <div>
//         <ProjectList orgId={organization.id} />
//       </div>
//       <div>
//         Show user assigned and reported issue here
//       </div>
//     </div>
//   );
// };

// export default Organization;




// NO "use client" here – this must remain a server component

import { getOrganization } from '@/actions/organization';
import OrgSwitcher from '@/components/org-switcher';
import ProjectList from './_components/project.list';

const OrganizationPage = async ({ params }) => {
  const { orgId } = await params; // ✅ only works if server component
  const { organization: orgData } = await getOrganization(orgId); // ✅ FIXED destructuring

  if (!orgData) {
    return (
      <div className="text-red-500 text-center py-10">
        <p>Organization not found or you do not have permission to view it.</p>
      </div>
    );
  }

  // console.log("✅ organization name:", orgData);

  return (
    <div className='text-amber-50'>
      <div className='mb-4 flex flex-col sm:flex-row justify-between items-start'>
        <h1 className='text-5xl font-bold pb-2 '>{orgData.name ?? 'Organization'}'s Project</h1>
        <OrgSwitcher className='text-amber-50' />
      </div>
      <div>
        <ProjectList orgId={orgData.id} />
      </div>
      <div>
      </div>
    </div>
  );
};

export default OrganizationPage;
