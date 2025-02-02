import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

// Check if the user is signed in
export const isAuthenticated = async (req) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Unauthorized: User not logged in.");
  }
  return session.user;
};

// Check if the user is the owner of the account
export const isOwner = async (accountId, userId) => {
  const account = await Account.findOne({ _id: accountId, userId });
  if (!account) {
    throw new Error("Forbidden: You do not have permission to modify this account.");
  }
};
