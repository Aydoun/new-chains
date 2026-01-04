export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  bio: string;
  createdAt?: string;
  updatedAt?: string;
}

export type FrameType = "PHRASE" | "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";

export interface Sequence {
  id: number;
  title: string;
  description: string;
  url?: string | null;
  userId: number;
  user: {
    id: number;
    username: string;
    avatarUrl?: string | null;
  };
  model?: string;
  timeout?: number;
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

export type SequenceCreationFormValues = {
  title: string;
  description?: string;
  model: string;
  timeout: number;
  pages: {
    content: string;
    description?: string;
  }[];
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  userId?: string;
  timeFilter?: TimeFilter;
  search?: string;
};

export type TimeFilter =
  | "last-hour"
  | "today"
  | "this-week"
  | "this-month"
  | undefined;
