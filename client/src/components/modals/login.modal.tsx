import * as React from "react";
import { Auth } from "aws-amplify";
import useSimpleState from "@/hooks/useSimpleState";
import { Button, Modal } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import AppContext from "@/context/app.context";
import { CodeDeliveryDetails, CognitoUser } from "amazon-cognito-identity-js";
import { useLocation } from "wouter";
import { Badge } from "antd";
// forms
import ConfirmAccountForm from "../forms/confirm-account.form";
import ForgotPassForm from "../forms/forgot-pass.form";
import LoginForm from "../forms/login.form";
import ResetPassForm from "../forms/reset-pass.form";
import SignupForm from "../forms/sign-up.form";

enum FormType {
  LOGIN, // Set the form to a login form
  CONFIRM_ACCOUNT, // set the form to a account confirmation form
  NEW_PASSWORD, // the user exists but is forced to update password
  FORGOT_PASS_CONFIRM, // set the form to a forgot password confirm form
  FORGOT_PASS, // set the form to a reset password form
  NEW_ACCOUNT, // new account
}

interface State {
  open: boolean;
  formType: FormType;
  errorMsg: string | null;
  successMsg: string | null;
  userPlaceholder?: CognitoUser;
  codeDeliveryDetails?: CodeDeliveryDetails;
  loading: boolean;
}

const initState: State = {
  open: false,
  formType: FormType.LOGIN,
  errorMsg: null,
  successMsg: null,
  loading: false,
};

type FormName =
  | "login"
  | "sign-up"
  | "confirm"
  | "forgot-pass-confirm"
  | "forgot-pass"
  | "reset-pass-required";

interface ContextFunction {
  setFormType: (form: FormType) => void;
  resendConfirmCode: () => Promise<void>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (formName: FormName) => void;
}

const LoginModalContext = React.createContext<(State & ContextFunction) | null>(
  null
);

const LoginModal: React.FC = () => {
  const appContext = React.useContext(AppContext)!;
  const [state, set, unset] = useSimpleState(initState);
  const methods = useForm();
  const { getValues, reset, watch, formState } = methods;
  const setLocation = useLocation()[1];

  React.useEffect(() => {
    reset();
    if (state.open) unset(["formType"]);
  }, [state.open, unset, reset]);

  React.useEffect(() => {
    set(["errorMsg"], [null]);
  }, [state.formType, set]);

  const onChange = () => set(["errorMsg", "successMsg"], [null, null]);

  const onSubmit = async (formName: FormName) => {
    if (!formState.isValid) return;
    set(["loading"], [true]);
    const values = getValues();
    switch (formName) {
      case "login":
        /* -- LOGIN SUBMITTED -- */
        try {
          const login = await Auth.signIn(values.email, values.password);
          if (login.challengeName === "NEW_PASSWORD_REQUIRED")
            set(
              ["formType", "userPlaceholder", "open"],
              [FormType.NEW_PASSWORD, login, false]
            );
          else await appContext.refreshUser();
        } catch (e) {
          if ((e as Error).name === "UserNotConfirmedException") {
            try {
              const sent = await Auth.resendSignUp(values.email);
              set(
                ["formType", "codeDeliveryDetails"],
                [FormType.CONFIRM_ACCOUNT, sent.CodeDeliveryDetails]
              );
            } catch (e2) {
              set(["errorMsg"], [(e2 as Error).message || "Unknown Error"]);
            }
          } else if (
            ["ResourceNotFoundException", "NotAuthorizedException"].includes(
              (e as Error).name
            )
          )
            set(["errorMsg"], ["Incorrect email and/or password"]);
          else set(["errorMsg"], [(e as Error).message || "Unknown Error"]);
        }
        break;
      case "sign-up":
        /* -- SIGN UP SUBMITTED -- */
        try {
          await Auth.signOut(); // kill the old session just in case
          const user = await Auth.signUp({
            username: values.email,
            password: values.password,
          });
          set(
            ["formType", "codeDeliveryDetails"],
            [FormType.CONFIRM_ACCOUNT, user.codeDeliveryDetails]
          );
        } catch (e) {
          set(["errorMsg"], [(e as Error).message || "Unknown Error"]);
        }
        break;
      case "confirm":
        /* -- CONFIRM SUBMITTED -- */
        try {
          await Auth.confirmSignUp(
            values.email,
            values.confirmationCode.trim()
          );
          await Auth.signIn(values.email, values.password);
          await appContext.refreshUser();
          set(["open"], [false])
        } catch (e) {
          if ((e as Error).name === "ResourceNotFoundException")
            set(["errorMsg"], ["Failed to create user sessiom"]);
          else set(["errorMsg"], [(e as Error).message || "Unknown Error"]);
        }
        break;
      case "forgot-pass":
        /* -- FORGOT PASS -- */
        try {
          await Auth.forgotPassword(values.email);
          set(["formType"], [FormType.FORGOT_PASS_CONFIRM]);
        } catch (e) {
          set(["errorMsg"], [(e as Error).message || "Unknown Error"]);
        }
        break;
      case "forgot-pass-confirm":
        /* -- CONFIRM FORGOT PASS -- */
        try {
          await Auth.forgotPasswordSubmit(
            values.email,
            values.forgotCode,
            values.newPassword
          );
          set(
            ["formType", "successMsg"],
            [FormType.LOGIN, "Successfuly reset your password. Please login."]
          );
        } catch (e) {
          if ((e as Error).name === "CodeMismatchException") {
            set(["errorMsg"], [(e as Error).message || "Unknown Error"]);
          } else set(["errorMsg"], ["Failed to reset your password."]);
        }
        break;
      case "reset-pass-required":
        try {
          await Auth.completeNewPassword(
            state.userPlaceholder!,
            values.newPassword
          );
          set(
            ["formType", "successMsg"],
            [FormType.LOGIN, "Successfuly reset your password. Please login."]
          );
        } catch (e) {
          set(["errorMsg"], [(e as Error).message || "Unknown Error"]);
        }
    }
    set(["loading"], [false]);
  };

  const resendConfirmCode = async () => {
    set(["loading"], [true]);
    try {
      const sent = await Auth.resendSignUp(watch("email"));
      const email = sent.CodeDeliveryDetails.Destination || "your email";
      set(["successMsg"], [`Re-sent confirmation code to ${email}`]);
    } catch (e) {
      set(["errorMsg"], [(e as Error).message || "Unknown Error"]);
    }
    set(["loading"], [false]);
  };

  const logout = async () => {
    await Auth.signOut()
    appContext.refreshUser()
    setLocation("/")
  }

  return (
    <React.Fragment>
      {appContext.isAuthenticated ? (
        <Button.Group>
          <Button onClick={() => setLocation("/profile")}>Profile</Button>
          <Button onClick={logout}>Logout</Button>
        </Button.Group>
      ) : (
        <Button onClick={() => set(["open"], [true])}>Login</Button>
      )}
      <Modal
        open={state.open}
        onCancel={() => set(["open"], [false])}
        closeIcon
        footer={null}
      >
        <h4>
          {state.formType === FormType.LOGIN && "Login"}
          {state.formType === FormType.CONFIRM_ACCOUNT && "Confirm Email"}
          {state.formType === FormType.FORGOT_PASS && "Password Reset"}
          {state.formType === FormType.FORGOT_PASS_CONFIRM && "Reset Password"}
          {state.formType === FormType.NEW_PASSWORD && "New Password Required"}
          {state.formType === FormType.NEW_ACCOUNT && "Sign Up"}
        </h4>
        {!!state.errorMsg && <Badge>{state.errorMsg}</Badge>}
        {!!state.successMsg && (
          <Badge style={{ backgroundColor: "green", color: "white" }}>
            {state.successMsg}
          </Badge>
        )}
        <FormProvider {...methods}>
          <LoginModalContext.Provider
            value={{
              ...state,
              onChange,
              onSubmit,
              resendConfirmCode,
              setFormType: (form) => set(["formType"], [form]),
            }}
          >
            {state.formType === FormType.LOGIN && <LoginForm />}
            {state.formType === FormType.CONFIRM_ACCOUNT && (
              <ConfirmAccountForm />
            )}
            {state.formType === FormType.FORGOT_PASS && <ForgotPassForm />}
            {state.formType === FormType.FORGOT_PASS_CONFIRM && (
              <ResetPassForm formName="forgot-pass-confirm" />
            )}
            {state.formType === FormType.NEW_PASSWORD && (
              <ResetPassForm formName="reset-pass-required" />
            )}
            {state.formType === FormType.NEW_ACCOUNT && <SignupForm />}
          </LoginModalContext.Provider>
        </FormProvider>
      </Modal>
    </React.Fragment>
  );
};

export default LoginModal;
export { LoginModalContext, FormType, type FormName };
