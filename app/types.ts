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
  /** Live (not deleted) comments on the sequence. */
  commentCount?: number;
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
  /** Web link the frame opens in a new tab, if any. */
  linkUrl?: string | null;
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
    /** Web link as typed; checked and normalised on save. */
    linkUrl?: string;
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

export interface CommentAuthor {
  id: number;
  username: string;
  avatarUrl?: string | null;
}

export interface SequenceComment {
  id: number;
  content: string;
  sequenceId: number;
  authorId: number;
  author: CommentAuthor;
  createdAt: string;
  updatedAt: string;
}

/** A page of comments, newest first; `nextCursor` loads the older ones. */
export interface CommentsPage {
  items: SequenceComment[];
  hasMore: boolean;
  nextCursor: number | null;
  /** Live comments on the sequence, across all pages. */
  total: number;
}

/** An uploaded image in the user's assets folder. */
export interface LibraryAsset extends FrameAsset {
  id: number;
  contentType: string;
  createdAt: string;
  /** The user's live sequences that show this image, newest first. */
  sequences: { id: number; title: string }[];
}
