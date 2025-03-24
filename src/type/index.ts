import { SVGProps } from "react";

export interface IChat {
  _id?: string;
  senderId: IUser;
  receiverId: IUser;
  content: string;
  isRead?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUserProps {
  avatarProps: {
    src: string;
  };
  description?: string;
  name: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
  chats?: IChat[];
  followers: string[]; // Array of ObjectIds referencing 'User'
  following: string[]; // Array of ObjectIds referencing 'User'
  friendRequestsSent: string[];
  friendRequestsReceived: IUser[];
  friends: string[];
  isVerified: boolean;
  role: "admin" | "user";
  gender?: "Male" | "Female" | "Other";
  dateOfBirth?: string;
  location?: string;
  website?: string;
  phone?: string;
  joinedAt?: string;
  lastActiveAt?: string;
  status: "in-progress" | "blocked";
  paymentStatus?: "Pending" | "Paid" | "Failed";
  transactionId?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserData {
  data: { data: IUser };
}

export interface IPost {
  _id: string;
  author: IUser;
  content: string;
  images?: string[];
  isPremium: boolean;
  likes: IUser[];
  dislikes: IUser[];
  comments: IComment[];
  createdAt: string;
  updatedAt: string;
}

export interface IPostData {
  data: { data: IPost[] };
}

export interface IComment {
  _id: string;
  postId: IPost;
  userId: IUser;
  comment: string;
  // parentCommentId?: Types.ObjectId | null;
  createdAt: string; // Automatically managed by Mongoose
  updatedAt: string; // Automatically managed by Mongoose
}

export interface IInput {
  variant?: "flat" | "bordered" | "faded" | "underlined";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  type?: string;
  label: string;
  name: string;
  disabled?: boolean;
}

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
