import { IUser, OwnedResource, Session } from "@/types/auth";
import { Logger } from "@/types/common";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Model } from "mongoose";
import { AuthenticationError } from "./errors";

const validateSession = (session: Session | null): boolean => {
  return session?.user !== undefined;
};


// Check if the user is signed in
export const isAuthenticated = async (): Promise<IUser | null> => {
      
  try {
    const session = await getServerSession(authOptions);
    if (!validateSession(session)) {
      throw new AuthenticationError("Unauthorized: User not logged in.");
    }
  return session.user;
  } catch (error) {
    console.error('Error in isAuthenticated:', error);
    throw error;
    
  }
};

// Make isOwner generic with type constraint
export const isOwner = async <T extends OwnedResource>(
  resourceId: string, 
  userId: string,
  model: Model<T>
): Promise<void> => {
  
  try {
    const resource = await model.findOne({ 
      _id: resourceId, 
      userId 
    });
  
    if (!resource) {
      throw new Error(`Forbidden: You do not have permission to modify this ${model.modelName.toLowerCase()}.`);
    }
  } catch (error) {
    console.error('Error in isOwner:', error);
    throw error;
    
  }
};
