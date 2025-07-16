// console.log("✅ Middleware is running"); // Add this at the top

// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';

// const isProtectedRoute = createRouteMatcher([
//   '/onboarding(.*)',
//   '/organization(.*)',
//   '/project(.*)',
//   '/issue(.*)',
//   '/sprint(.*)',
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   const { userId, redirectToSignIn } = await auth();

//   if (!userId && isProtectedRoute(req)) {
//     return redirectToSignIn({ returnBackUrl: req.url });
//   }

//   if (
//     auth().userId &&
//     !auth().orgId &&
//     req.nextUrl.pathname !== '/onboarding' &&
//     req.nextUrl.pathname !== '/'
//   ) {
//     return NextResponse.redirect(new URL('/onboarding', req.url));
//   }
// });

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:js|css|png|jpg|jpeg|svg|woff|woff2|ico)).*)',
//   ],
//   runtime: 'nodejs', // required to avoid Clerk + Edge conflict
// };



// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';

//   const isProtectedRoute = createRouteMatcher([
//   '/onboarding(.*)',
//   '/organization(.*)',
//   '/project(.*)',
//   '/issue(.*)',
//   '/sprint(.*)',
// ]);

// export default clerkMiddleware(async(auth,req)=>{
//   const {userId, redirectToSignIn} =await auth();

//   if(!userId && isProtectedRoute(req)){
//     return redirectToSignIn({returnBackUrl:req.url});
//   }
//   if(auth().userId && !auth().orgId && req.nextUrl.pathname !== '/onboarding' && req.nextUrl.pathname !== '/'){
//     return NextResponse.redirect(new URL('/',req.url));
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };


import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};