import * as React from "react";
import { Spin } from "antd";

const Loading: React.FC = () => {
  return (
    <div className="flex center w-100 h-100">
      <Spin tip="Loading..." size="large" />
    </div>
  );
};

export default Loading;
