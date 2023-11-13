import * as React from "react";
import { Button, Badge } from "antd";
import { useFormContext } from "react-hook-form";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import * as UTIL from "@/util";
import { FormType, LoginModalContext } from "../modals/login.modal";
import BarText from "../bar-text";
import { Input, InputPass } from "@/components/input";

const SignupForm: React.FC = () => {
  const context = React.useContext(LoginModalContext)!;
  const {
    formState: { errors, isValid },
    trigger,
  } = useFormContext();

  React.useEffect(() => {
    trigger();
  }, [trigger]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("RUNNING THE FUCKING FUNCTION");
    trigger();
    context.onChange?.(e);
  };

  return (
    <React.Fragment>
      {errors["password"] && errors["password"].type === "pattern" && (
        <Badge style={{ wordWrap: "break-word", width: "100%" }}>
          Password must contain:
          <br />
          - At least 1 uppercase letter
          <br />
          - At least 1 lowercase letter
          <br />
          - At least 1 number
          <br />
          - At least 1 special character (!@#$%^&*)
          <br />
          - Be at least 8 characters long
          <br />
        </Badge>
      )}
      <Input
        input={{
          placeholder: "Email",
          status: errors["email"] ? "error" : undefined,
          prefix: <MailOutlined />,
        }}
        name="email"
        rules={{
          pattern: {
            value: UTIL.EMAIL_REGEX,
            message: "Please enter a valid email",
          },
          required: "Email is required",
          onChange,
        }}
      />
      <InputPass
        input={{
          placeholder: "Password",
            "aria-label": "password",
            status: errors["password"] ? "error" : undefined,
            prefix: <LockOutlined />,
         }}
        name="password"
        rules={{
          required: "Password is required",
          onChange,
        }}
      />
       <InputPass
        input={{
          placeholder: "Confirm Password",
            "aria-label": "confirmPassword",
            status: errors["confirmPassword"] ? "error" : undefined,
            prefix: <LockOutlined />,
         }}
         name="confirmPassword"
         rules={{
          required: "Please verify your password",
          onChange,
        }}
      />
      <div className="flex flex-col end2">
        <div className="spacer" />
        <Button
          type="link"
          onClick={() => context.setFormType(FormType.FORGOT_PASS)}
        >
          Forgot password?
        </Button>
      </div>
      <Button
        disabled={!isValid || context.loading}
        onClick={() => context.onSubmit("sign-up")}
        loading={context.loading}
        type="primary"
      >
        Create Account
      </Button>
      <BarText title="Already have an account?" style={{ color: "darkgrey" }} />
      <Button onClick={() => context.setFormType(FormType.LOGIN)}>Login</Button>
    </React.Fragment>
  );
};

export default SignupForm;
