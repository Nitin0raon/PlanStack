"use server";

import { db } from "@/lib/prisma";
import { auth} from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function getOrganization(slug) {
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

  const response = await clerkClient.organizations.getOrganization({ slug })
  if (!response) {
    return null;
  }

  // // // --- FIX STARTS HERE ---
  // const { data } = await clerkClient.organizations.getOrganizationMembershipList({
  //   organizationId: response.id,
  // });

  // // // Ensure 'data' is an array before trying to assign it to membership
  // const membership = Array.isArray(data) ? data : [];

  // // // --- FIX ENDS HERE ---

  // const userMembership = membership.find(
  //   (member) => member.publicUserData?.userId === userId // Added optional chaining for safety
  // );

  // if (!userMembership) {
  //   return null;
  // }

  return response; // optionally: { organization, userMembership }
}