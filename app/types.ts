export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

export type Visibility = "PUBLIC" | "PRIVATE" | "FRIENDS_ONLY";
export type FrameType = "PHRASE" | "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";

export interface Frame {
  id: number;
  type: FrameType;
  description?: string | null;
  content: string;
  reportedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: number;
  title: string;
  description: string;
  url?: string | null;
  userId: number;
  FrameOrder: number[];
  isDeleted: boolean;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
}

export interface Sequence extends Collection {
  frames: Frame[];
}
