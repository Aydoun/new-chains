export const API_BASE_URL = "/api/";

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 50;

export const MOBILE_BREAKPOINT = 768;

export const BIO_MAX_LENGTH = 240;
export const CONTACT_MESSAGE_MAX_LENGTH = 240;
export const COMMENT_MAX_LENGTH = 1_000;
export const COMMENTS_PAGE_SIZE = 10;

export const SEARCH_DEBOUNCE_DELAY = 800;

/** Query param that makes the studio open the "new sequence" form on load. */
export const CREATE_SEQUENCE_PARAM = "create";
export const STUDIO_CREATE_PATH = `/studio?${CREATE_SEQUENCE_PARAM}=1`;
