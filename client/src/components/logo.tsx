import * as React from "react";

function Logo() {
  React.useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lobster&display=swap';
    link.rel = 'stylesheet';

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const lobsterFont = {
    fontFamily: 'Lobster, cursive',
    /* Other styles */
  };

  return (
    <div>
      <h1 style={lobsterFont}>Rally</h1>
    </div>
  );
}

export default Logo;