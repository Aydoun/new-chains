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
  FrameOrder: number[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
