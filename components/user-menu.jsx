"use client";

import { UserButton } from '@clerk/nextjs';
import { Brain, ChartNoAxesGantt } from 'lucide-react';
import React from 'react';

const UserMenu = () => {
  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: 'w-16 h-16',
          userButtonAvatarImage: 'w-16 h-16',
        },
      }}
    >
      <UserButton.MenuItems>
        {/* Custom Link to onboarding */}
        <UserButton.Link
          label="My Organizations"
          labelIcon={<ChartNoAxesGantt size={15} />}
          href="/onboarding"
        />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default UserMenu;

// "use client"
// import { UserButton } from '@clerk/nextjs'
// import { ChartNoAxesGantt } from 'lucide-react'
// import React from 'react'

// const UserMenu = () => {
//   return (
//     <UserButton
//   appearance={{
//     elements: {
//       avatarBox: 'w-16 h-16', // outer box size
//       userButtonAvatarImage: 'w-16 h-16', // actual image size
//     },
//   }}>
//     <UserButton.MenuItems>
//         <UserButton.Link label="My Organisations" labelIcon={<ChartNoAxesGantt size={15}/>}
//         href="/onboarding"/>
//     </UserButton.MenuItems>
//     <UserButton.Action label="manageAccount"/>
// </UserButton>
//   )
// }

// export default UserMenu

{/* <UserButton.MenuItems>
          <UserButton.Action
            label="My Organizations"
            labelIcon={<DotIcon />}
            onClick={() => alert('init chat')}
          />
        </UserButton.MenuItems> */}

// 'use client';

// import { UserButton } from '@clerk/nextjs';
// import { ChartNoAxesGantt } from 'lucide-react';

// const UserMenu = () => {
//   return (
//     <UserButton
//       appearance={{
//         elements: {
//           avatarBox: 'w-16 h-16',
//           userButtonAvatarImage: 'w-16 h-16',
//         },
//       }}
//     >
//       <UserButton.MenuItems>
//        <UserButton.Link label="My Organisations" labelIcon={<ChartNoAxesGantt size={15}/>}
//         href="/onboarding"/>
//     </UserButton.MenuItems>
//     </UserButton>
//   );
// };

// export default UserMenu;

