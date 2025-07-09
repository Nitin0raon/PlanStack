// "use server";

// import { db } from "@/lib/prisma";
// import { auth} from "@clerk/nextjs/server";
// import { clerkClient } from "@clerk/clerk-sdk-node";

// export async function getOrganization(slug) {
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

//   const response = await clerkClient.organizations.getOrganization({ slug })
//   if (!response) {
//     return null;
//   }

//   // // // --- FIX STARTS HERE ---
//   // const { data } = await clerkClient.organizations.getOrganizationMembershipList({
//   //   organizationId: response.id,
//   // });

//   // // // Ensure 'data' is an array before trying to assign it to membership
//   // const membership = Array.isArray(data) ? data : [];

//   // // // --- FIX ENDS HERE ---

//   // const userMembership = membership.find(
//   //   (member) => member.publicUserData?.userId === userId // Added optional chaining for safety
//   // );

//   // if (!userMembership) {
//   //   return null;
//   // }
//   //kjdkfjakjkjdiiefj

//   return response; // optionally: { organization, userMembership }
// }





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

    console.log("User is a member of the organization");

    return {
      organization: org,
      membership: userMembership,
    };

  } catch (err) {
    console.error("Error in getOrganization:", err);
    throw new Error("Organization not found or you do not have permission to view it.");
  }
}




// export async function getOrganizationUsers(orgId) {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const membershipsResponse = await clerkClient.organizations.getOrganizationMembershipList({
//     organizationId: orgId,
//   });

//   const memberships = Array.isArray(membershipsResponse)
//     ? membershipsResponse
//     : Array.isArray(membershipsResponse.items)
//       ? membershipsResponse.items
//       : [];

//   const users = memberships.map((m) => ({
//     id: m.publicUserData?.userId,
//     name:
//       m.publicUserData?.firstName && m.publicUserData?.lastName
//         ? `${m.publicUserData.firstName} ${m.publicUserData.lastName}`
//         : m.publicUserData?.identifier || "Unnamed User",
//     email: m.publicUserData?.identifier,
//   })).filter((u) => u.id); // Remove undefined/null

//   console.log("👥 Clerk users for org:", users);
//   return users;
// }

export async function getOrganizationUsers(orgId) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const membershipsResponse = await clerkClient.organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  const memberships = Array.isArray(membershipsResponse)
    ? membershipsResponse
    : Array.isArray(membershipsResponse.items)
      ? membershipsResponse.items
      : [];

  if (!Array.isArray(memberships)) {
    console.error("Memberships not returned as an array");
    return [];
  }

  const userIds = memberships
    .map((membership) => membership.publicUserData?.userId)
    .filter(Boolean); // Remove null/undefined just in case

  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
    },
  });
  console.log("users", users);

  return users;
}