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
  firstFrame: Frame | null;
  FrameOrder: number[];
  visibility: Visibility;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  followers?: SequenceFollower[];
  followerCount?: number;
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
  viewerState?: {
    isFollower: boolean;
    isMuted: boolean;
  };
}

export type SequenceFollower = {
  id: number;
  username: string;
  avatarUrl?: string | null;
  muted: boolean;
};

export type SequenceNotification = {
  id: number;
  sequenceId: number;
  type: NotificationKind;
  message: string;
  read: boolean;
  createdAt: string;
  sequence?: {
    id: number;
    title: string;
  };
};

export type NotificationKind =
  | "STEPS_UPDATED"
  | "NOTE_ADDED"
  | "MILESTONE_MARKED";

export type Visibility = "PUBLIC" | "PRIVATE" | "FRIENDS_ONLY";

export type SequenceCreationFormValues = {
  title: string;
  description?: string;
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
