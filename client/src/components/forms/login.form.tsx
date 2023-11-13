import * as React from "react";
import { Button } from "antd";
import { useFormContext } from "react-hook-form";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import * as UTIL from "@/util";
import { FormType, LoginModalContext } from "../modals/login.modal";
import BarText from "../bar-text";
import { Input, InputPass } from "@/components/input";

const LoginForm: React.FC = () => {
  const context = React.useContext(LoginModalContext)!;
  const {
    formState: { errors, isValid },
    trigger,
  } = useFormContext();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    trigger();
    context.onChange?.(e);
  };

  return (
    <React.Fragment>
      <Input
        input={{
          placeholder: "Email",
          "aria-label": "email",
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
        onClick={() => context.onSubmit("login")}
        loading={context.loading}
        type="primary"
      >
        Login
      </Button>
      <BarText title="Dont have an account?" style={{ color: "darkgrey" }} />
      <Button onClick={() => context.setFormType(FormType.NEW_ACCOUNT)}>
        Create Account
      </Button>
    </React.Fragment>
  );
};

export default LoginForm;
