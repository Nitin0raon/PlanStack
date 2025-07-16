import {SignedIn, SignedOut, SignInButton} from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import UserMenu from './user-menu'
import { checkUser } from '@/lib/checkUser'
import UserLoading from './user-loading'

const Header = async() => {
  await checkUser();
  return (
    <header className='container mx-auto'>
        <nav className='py-6 px-4 flex justify-between items-center'>
            <Link href='/'>
            <Image
             src={'/logo.jpg'} alt='PlanStack logo' width={200} height={56}
             className='h-10 w-auto object-contain'/>
            </Link>
        
        <div className='flex item-center gap-4'>
            <Link href={'/project/create'}>
            <Button variant="mybut">
                <span>Create Project</span>
            </Button>
            </Link>
            <SignedOut>
            <SignInButton forceRedirectUrl='/onboarding'>
            <Button variant='outline'>Login</Button>
            </SignInButton>
        </SignedOut>
        <SignedIn>
            <UserMenu/>
        </SignedIn>
        </div>
        </nav>
        {/* <UserLoading/> */}
    </header>
  )
}

export default Header

// import { SignedIn, SignedOut, SignIn, SignInButton, UserButton } from '@clerk/nextjs'
// import React from 'react'

// const Header = () => {
//   return (
//     <>
//     <SignedOut>
//         <SignInButton/>
//     </SignedOut>
//     <SignedIn>
//         <UserButton/>
//     </SignedIn>
//     </>
//   )
// }

// export default Header