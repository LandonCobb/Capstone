import * as React from "react";
import LoginModal from "@/components/modals/login.modal";
import { Button } from "antd";
import { Auth } from "aws-amplify";
import { useLocation } from "wouter";
import AppContext from "@/context/app.context";

interface Props {
  children?: React.ReactNode;
}

const AuthTemplate: React.FC<Props> = ({ children }) => {
  const appContext = React.useContext(AppContext)!;
  const setLocation = useLocation()[1];

  const logout = async () => {
    await Auth.signOut();
    appContext.refreshUser();
    setLocation("/");
  };

  return (
    <div>
      <div>
        Header stuff for authed page
        <Button.Group>
          <Button>Edit Profile</Button>
          <Button onClick={logout}>Logout</Button>
        </Button.Group>
      </div>

      {children}

      <div>Footer stuff for authed page</div>
    </div>
  );
};

export default AuthTemplate;
