
"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function getOrganization(slug) {
  try {
    if (!slug || typeof slug !== "string") {
      console.error("Invalid or missing organization slug:", slug);
      throw new Error("Invalid organization slug");
    }

    const { userId } = await auth();
    if (!userId) {
      console.error("User not authenticated");
      throw new Error("Unauthorized");
    }

    // console.log("Authenticated userId:", userId);

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      console.error("User not found in local database");
      throw new Error("User not found");
    }

    const org = await clerkClient.organizations.getOrganization({ slug });
    if (!org) {
      console.error("No organization found for slug:", slug);
      return null;
    }

    // console.log("Fetched organization:", org.id, org.name);

    const membershipResponse = await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: org.id,
    });

    // console.log("Membership response:", membershipResponse);

    // Use items or direct array depending on format
    const memberships = Array.isArray(membershipResponse)
      ? membershipResponse
      : Array.isArray(membershipResponse.items)
        ? membershipResponse.items
        : [];

    if (!Array.isArray(memberships)) {
      console.error("Memberships not returned as array:", memberships);
      return null;
    }

    // console.log("Membership userIds:", memberships.map(m => m.publicUserData?.userId));

    const userMembership = memberships.find(
      (member) => member.publicUserData?.userId === userId
    );

    if (!userMembership) {
      console.warn("User is not a member of the organization");
      return null;
    }

    // console.log("User is a member of the organization");

    return {
      organization: org,
      membership: userMembership,
    };

  } catch (err) {
    console.error("Error in getOrganization:", err);
    throw new Error("Organization not found or you do not have permission to view it.");
  }
}




// actions/organization.js

// export async function getOrganizationUsers(orgId) {
//   const { userId } = await auth();
//   if (!userId) {
//     throw new Error("Unauthorized");
//   }

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   try {
//     const organizationMemberships =
//       await clerkClient.organizations.getOrganizationMembershipList({
//         organizationId: orgId,
//       });

//     // IMPORTANT: Check the structure returned by Clerk.
//     // Based on your logs, 'organizationMemberships' IS THE ARRAY.
//     // It's not an object with a 'data' property.

//     // *** REMOVED `.data` from the check ***
//     if (!organizationMemberships || !Array.isArray(organizationMemberships)) {
//       console.warn(`No organization memberships found or invalid data structure for orgId: ${orgId}. Received:`, organizationMemberships);
//       return [];
//     }

//     // *** REMOVED `.data` from the map source ***
//     const userIds = organizationMemberships.map(
//       (membership) => membership.publicUserData.userId
//     );

//     const users = await db.user.findMany({
//       where: {
//         clerkUserId: {
//           in: userIds,
//         },
//       },
//     });
//     console.log("Fetched organization users from DB:", users);
//     return users;

//   } catch (error) {
//     console.error(`Error fetching organization memberships for orgId ${orgId}:`, error);
//     throw error;
//   }
// }



export async function getOrganizationUsers(orgId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const requestingUser = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!requestingUser) throw new Error("User not found");

  // Fetch organization memberships using Clerk
  const membershipsResponse = await clerkClient.organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  // Normalize membership list (handles both Clerk SDK styles)
  const memberships = Array.isArray(membershipsResponse)
    ? membershipsResponse
    : Array.isArray(membershipsResponse.items)
      ? membershipsResponse.items
      : [];

  // Extract Clerk user IDs from membership list
  const clerkUserIds = memberships
    .map((m) => m.publicUserData?.userId)
    .filter(Boolean);

  // Find local users that match the Clerk IDs
  const localUsers = await db.user.findMany({
    where: {
      clerkUserId: {
        in: clerkUserIds,
      },
    },
  });

  // Return combined data (local DB ID + Clerk name)
  const combinedUsers = localUsers.map((dbUser) => {
    const membership = memberships.find(
      (m) => m.publicUserData?.userId === dbUser.clerkUserId
    );

    return {
      id: dbUser.id,
      name: `${membership?.publicUserData?.firstName ?? ""} ${membership?.publicUserData?.lastName ?? ""}`.trim(),
    };
  });

  return combinedUsers;
}


