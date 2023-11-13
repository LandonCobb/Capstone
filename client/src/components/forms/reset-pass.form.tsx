import * as React from "react";
import { Button, Badge } from "antd";
import { useFormContext } from "react-hook-form";
import { LockOutlined } from "@ant-design/icons";
import * as UTIL from "@/util";
import { LoginModalContext } from "../modals/login.modal";
import { Input, InputPass } from "@/components/input";

interface Props {
  formName: "forgot-pass-confirm" | "reset-pass-required";
}

const ResetPassForm: React.FC<Props> = ({ formName }) => {
  const context = React.useContext(LoginModalContext)!;
  const {
    trigger,
    watch,
    formState: { errors, isValid },
  } = useFormContext();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    trigger();
    context.onChange?.(e);
  };

  return (
    <React.Fragment>
      {!!errors["newPassword"] && errors["newPassword"].type === "pattern" && (
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
      {formName == "forgot-pass-confirm" && (
        <Input
          input={{
            placeholder: "Confirmation code",
            "aria-label": "confirmation code",
            autoComplete: "code",
            status: errors["forgotCode"] ? "error" : undefined,
            prefix: <LockOutlined />,
          }}
          name="forgotCode"
          rules={{
            required: "Confirmation code is required",
            onChange,
          }}
        />
      )}
      <InputPass
        input={{
          placeholder: "Password",
          "aria-label": "new password",
          autoComplete: "new-password",
          status: errors["newPassword"] ? "error" : undefined,
          prefix: <LockOutlined />,
        }}
        name="newPassword"
        rules={{
          required: "Password is required",
          pattern: {
            value: UTIL.PASSWORD_REGEX,
            message: "Password is not strong enough",
          },
          onChange,
        }}
      />
      <InputPass
        input={{
          placeholder: "Re-enter password",
          "aria-label": "confirm password",
          autoComplete: "confirm-password",
          status: errors["confirmNewPassword"] ? "error" : undefined,
          prefix: <LockOutlined />,
        }}
        name="confirmNewPassword"
        rules={{
          deps: ["newPassword"],
          required: "Confirm password is required",
          onChange,
          validate: (val: string) =>
            watch("newPassword") !== val
              ? "Your passwords do not match."
              : true,
        }}
      />
      <Button
        disabled={!isValid || context.loading}
        onClick={() => context.onSubmit(formName)}
        style={{ marginTop: 20 }}
        loading={context.loading}
      >
        {formName === "forgot-pass-confirm"
          ? "Reset Password"
          : "Update Password"}
      </Button>
    </React.Fragment>
  );
};

export default ResetPassForm;
