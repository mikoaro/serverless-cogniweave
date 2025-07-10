export const CREATE_PROFILE_API_URL: string =
  process.env.NEXT_PUBLIC_CREATE_PROFILE_API_URL || "https://n7b2is7rdk.execute-api.us-east-1.amazonaws.com/v1/users";
export const TRANSFORM_CONTENT_API_URL: string =
  process.env.NEXT_PUBLIC_TRANSFORM_CONTENT_API_URL ||
  "https://n7b2is7rdk.execute-api.us-east-1.amazonaws.com/v1/transform";
export const MAX_RETRIES: number = 3;
export const SITE_TITLE: string = "CogniWeave App";
export const SITE_DESCRIPTION: string = "CogniWeave next app";
export const MAX_ITEMS_PER_PAGE: number = 10;
