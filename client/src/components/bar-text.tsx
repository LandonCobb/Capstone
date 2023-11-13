import * as React from "react";

type Props = {
  title: string;
  style?: React.CSSProperties
};

const BarText: React.FC<Props> = ({ title, style }) => {
  return (
    <span className="bar-text" style={style}>
      {title}
    </span>
  );
};

export default BarText;
