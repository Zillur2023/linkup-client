import { SVGProps } from "react";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  coverImage?: string;
  followers: string[];
  following: string[];
  isVerified: boolean;
  role: "admin" | "user";
  paymentStatus?: "Pending" | "Paid" | "Failed";
  transactionId?: string;
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
