import { SVGProps } from "react";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    image: string;
    followers: string[]; 
    following: string[]; 
    isVerified: boolean;
    role: 'admin' | 'user'; 
    paymentStatus?: 'Pending' | 'Paid' | 'Failed';
    transactionId?: string;
 
  }

export interface IUserData {
  data: {data: IUser}
}

export interface IPost {
  _id: string;
  author: IUser; 
  title: string;
  category: string;
  content: string;
  image?: string; 
  isPremium: boolean; 
  likes: IUser[];
  dislikes: IUser[]; 
  comments:IComment[];
  createdAt: string; 
  updatedAt: string;
}

export interface IPostData {
  data: {data: IPost[]}
}

export interface IComment {
  _id: string;
  postId: IPost; 
  userId: IUser; 
  commentText: string; 
  // parentCommentId?: Types.ObjectId | null; 
}


  export interface IInput {
    variant?: "flat" | "bordered" | "faded" | "underlined";
    size?: "sm" | "md" | "lg";
    required?: boolean;
    type?: string ;
    label: string;
    name: string ;
    disabled?: boolean;
  }

  export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
  };

