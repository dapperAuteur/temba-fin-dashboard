import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Model, Types } from "mongoose";

// Define a common interface for owned resources
interface OwnedResource {
  userId: Types.ObjectId;
  _id: Types.ObjectId;
}

// Check if the user is signed in
export const isAuthenticated = async () => {
    
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Unauthorized: User not logged in.");
  }
  return session.user;
};

// Make isOwner generic with type constraint
export const isOwner = async <T extends OwnedResource>(
  resourceId: string, 
  userId: string,
  model: Model<T>
): Promise<void> => {
  const resource = await model.findOne({ 
    _id: resourceId, 
    userId 
  });

  if (!resource) {
    throw new Error(`Forbidden: You do not have permission to modify this ${model.modelName.toLowerCase()}.`);
  }
};
