import * as React from "react";
import { Button } from "antd";
import { LoginModalContext, FormType } from "../modals/login.modal";
import { useFormContext } from "react-hook-form";
import { MailOutlined } from "@ant-design/icons";
import * as UTIL from "@/util";
import { Input } from "@/components/input";

const ForgotPassForm: React.FC = () => {
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
      <p>
        Please enter your email to verify your account before resetting your
        password.
      </p>
      <Input
        input={{
          color: "primary",
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
      <Button
        disabled={!isValid || context.loading}
        onClick={() => context.onSubmit("forgot-pass")}
        style={{ marginTop: 20 }}
        loading={context.loading}
      >
        Send Code
      </Button>
      <div className="flex flex-row end2">
        <div className="spacer" />
        <Button onClick={() => context.setFormType(FormType.LOGIN)}>
          Cancel
        </Button>
      </div>
    </React.Fragment>
  );
};

export default ForgotPassForm;
