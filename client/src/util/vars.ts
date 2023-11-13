export const REGION = import.meta.env.VITE_REGION;
export const IDENTIY_POOL_ID = import.meta.env.VITE_IDENTITY_POOL_ID;
export const USER_POOL_ID = import.meta.env.VITE_USER_POOL_ID;
export const WEB_CLIENT_ID = import.meta.env.VITE_WEB_CLIENT_ID;
export const STIPRE_PK = import.meta.env.VITE_STRIPE_PK;
export const API_URI = "";
export const RESOURCE_URI = "";

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;