import { Amplify } from "aws-amplify";
import * as T from "@/types";
import { IDENTIY_POOL_ID, REGION, USER_POOL_ID, WEB_CLIENT_ID } from "@/util";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";

/**
 * AWS Amplify init
 */
export const amplify = () => {
  Amplify.configure({
    Auth: {
      region: REGION,
      identityPoolId: IDENTIY_POOL_ID,
      userPoolId: USER_POOL_ID,
      userPoolWebClientId: WEB_CLIENT_ID,
      authenticationFlowType: "USER_SRP_AUTH",
    },
  });
};

/**
 * Parse user attributes to JS types.
 * @param attributes user attributes
 * @returns user object
 */
export const parseUserToJSTypes = (
  attributes: CognitoUserAttribute[]
): T.User =>
  attributes.reduce(
    (orig: { [key: string]: unknown }, attr: CognitoUserAttribute) => {
      let value;
      try {
        value = JSON.parse(attr.Value);
      } catch {
        value = Number.isFinite(attr.Value)
          ? Number.isInteger(attr.Value)
            ? parseInt(attr.Value)
            : parseFloat(attr.Value)
          : attr.Value;
      }
      orig[attr.Name.replace(/custom:/g, "").replace(/sub/g, "uid")] = value;
      return orig;
    },
    {}
  ) as unknown as T.User;
