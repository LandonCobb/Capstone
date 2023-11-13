import * as React from "react";
import { Button, Badge } from "antd";
import { useFormContext } from "react-hook-form";
import { LoginModalContext } from "../modals/login.modal";
import { LockOutlined } from "@ant-design/icons";
import { Input } from "@/components/input";

const ConfirmAccountForm: React.FC = () => {
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
      <h5>We sent a confirmation code to:</h5>
      <Badge>{context.codeDeliveryDetails?.Destination || "Your email"}</Badge>
      <p>Please confirm your email to continue.</p>
      <Input
        input={{
          color: "primary",
          placeholder: "Confirmation code",
          "aria-label": "confirmation code",
          status: errors["confirmationCode"] ? "error" : undefined,
          prefix: <LockOutlined />,
        }}
        rules={{
          required: "Confirmation code is required",
          onChange,
        }}
        name="confirmationCode"
      />
      <Button
        type="primary"
        disabled={!isValid || context.loading}
        onClick={() => context.onSubmit("confirm")}
        style={{ marginTop: 20 }}
        loading={context.loading}
      >
        Confirm Email
      </Button>
      <Button onClick={context.resendConfirmCode}>Re-send code</Button>
    </React.Fragment>
  );
};

export default ConfirmAccountForm;
