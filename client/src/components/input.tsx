import * as React from "react";
import { Input as In, InputProps } from "antd";
import { Controller, useFormContext } from "react-hook-form";

const Input: React.FC<{
  input: InputProps;
  name: string;
  rules?: { [key: string]: unknown };
}> = (props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={props.name}
      control={control}
      rules={props.rules}
      render={({ field }) => <In {...field} {...props.input} />}
    />
  );
};

const InputPass: React.FC<{
  input: InputProps;
  name: string;
  rules?: { [key: string]: unknown };
}> = (props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={props.name}
      control={control}
      rules={props.rules}
      render={({ field }) => <In.Password {...field} {...props.input} />}
    />
  );
};

export { Input, InputPass };
