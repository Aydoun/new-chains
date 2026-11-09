/** Public profile; `email` is only returned for your own account. */
export interface User {
  id: number;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
  email?: string;
  createdAt?: string;
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
}

/** The picture of an IMAGE frame. */
export interface FrameAsset {
  url: string;
  width: number;
  height: number;
}

/** Returned by the upload API. */
export interface UploadedAsset extends FrameAsset {
  id: number;
  contentType: string;
}

export interface Frame {
  id: number;
  type: FrameType;
  description?: string | null;
  content: string;
  assetId?: number | null;
  asset?: FrameAsset | null;
  createdById?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface SingleSequence extends Sequence {
  frames: Frame[];
  likedFrames: number[];
}

export type Visibility = "PUBLIC" | "PRIVATE" | "FRIENDS_ONLY";

export interface Snippet {
  id: number;
  type: FrameType;
  notes?: string | null;
  frameId: number;
  originSequenceId: number;
  originSequence: {
    id: number;
    title: string;
  };
  frame: Frame;
  createdAt: string;
  updatedAt: string;
}

export type SequenceCreationFormValues = {
  title: string;
  description?: string;
  pages: {
    content: string;
    description?: string;
    /** Uploaded image for this frame, if any. */
    asset?: UploadedAsset | null;
  }[];
};

export type SequenceTemplate = {
  title: string;
  description: string;
  outcome: string;
  steps: {
    content: string;
    description: string;
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
