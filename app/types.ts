export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

export type Visibility = "PUBLIC" | "PRIVATE" | "FRIENDS_ONLY";
export type FrameType = "PHRASE" | "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";

export interface Story {
  id: number;
  title: string;
  description: string;
  userId: number;
  isDeleted: boolean;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
  sequences?: Sequence[];
}

export interface Sequence {
  id: number;
  title: string;
  description: string;
  url?: string | null;
  userId: number;
  FrameOrder: number[];
  storyId?: number | null;
  story?: Story | null;
  isDeleted: boolean;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
}
