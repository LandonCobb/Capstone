import axios from "axios";
import { Auth } from "aws-amplify";
import * as Util from "@/util";

export const $http = axios.create({
  baseURL: Util.API_URI,
  headers: { "Content-Type": "application/json" },
});

$http.interceptors.request.use(async (req) => {
  try {
    const session = await Auth.currentSession();
    (req.headers || {}).Authorization = `Bearer ${session
      .getAccessToken()
      .getJwtToken()}`;
  } catch {} // eslint-disable-line no-empty
  return req;
});

export const $httpS3 = axios.create({
  baseURL: Util.RESOURCE_URI,
  headers: { "Content-Type": "application/json" },
});

export const $httpS3Raw = axios.create({
  baseURL: Util.RESOURCE_URI,
});
