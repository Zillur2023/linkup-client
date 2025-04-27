import { SVGProps } from "react";

export interface IChatItem {
  _id: string;
  lastMsg: IMessage;
  receiverId: IUser;
  senderId: IUser;
}

export interface IMessage {
  _id: string;
  text: string;
  imageUrl: string;
  videoUrl: string;
  isSeen: boolean;
  senderId: IUser;
  createdAt: string;
  updatedAt: string;
}

export interface IChat {
  _id: string;
  senderId: IUser;
  receiverId: IUser;
  messages: IMessage[];
  lastMsg: IMessage;
  createdAt: string;
  updatedAt: string;
}

export interface IChatApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IChat[];
}

// export interface IChat {
//   _id?: string;
//   senderId: IUser;
//   receiverId: IUser;
//   content: string;
//   isRead?: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

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
  friendRequestsSent: IUser[];
  friendRequestsReceived: IUser[];
  friends: IUser[];
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
  createdAt: string;
  updatedAt: string;
}

export interface IUserApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IUser;
}
export interface IUsersApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IUser[];
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

export interface IPostApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: IPost[];
}

export interface IComment {
  _id: string;
  postId: IPost;
  userId: IUser;
  content: string;
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
