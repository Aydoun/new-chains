export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

export type FrameType = "PHRASE" | "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";

export interface Sequence {
  id: number;
  title: string;
  description: string;
  url?: string | null;
  userId: number;
  user?: {
    id: number;
    username: string;
    avatarUrl?: string | null;
  };
  firstFrame: Frame | null;
  FrameOrder: number[];
  visibility: Visibility;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Frame {
  id: number;
  type: FrameType;
  description?: string | null;
  content: string;
  reportedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SingleSequence extends Sequence {
  frames: Frame[];
}

export type Visibility = "PUBLIC" | "PRIVATE" | "FRIENDS_ONLY";
