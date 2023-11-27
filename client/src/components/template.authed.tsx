import * as React from "react";
import { Menu, Button, Layout } from "antd";
import { useLocation } from "wouter";
import { Auth } from "aws-amplify";
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
    <Layout>
      <Layout.Header style={{ background: "red" }}>
        <div
          className="flex center"
          style={{ backgroundColor: "red", color: "white" }}
        >
          {/* LOGO GOES HERE; NOT IN THE MENU ELEMENET */}
          <Menu
            mode="horizontal"
            style={{ backgroundColor: "red", color: "white", width: "100%" }}
          >
            <Menu.Item key="home">
              <Button
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                  border: "0px",
                }}
                onClick={() => setLocation("/")}
              >
                Home
              </Button>
            </Menu.Item>
            <Menu.Item key="explore">
              <Button
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                  border: "0px",
                }}
                onClick={() => setLocation("/explore")}
              >
                Explore
              </Button>
            </Menu.Item>
            <Menu.Item key="createRally">
              <Button
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                  border: "0px",
                }}
                onClick={() => setLocation("/makerally")}
              >
                Host a Rally
              </Button>
            </Menu.Item>
          </Menu>
          <div className="spacer" />
          <Button.Group>
            <Button onClick={() => setLocation("/profile")}>Edit Profile</Button>
            <Button onClick={logout}>Logout</Button>
          </Button.Group>
        </div>
      </Layout.Header>
      <Layout.Content>{children}</Layout.Content>

      <Layout.Footer>Rally</Layout.Footer>
    </Layout>
  );
};

export default AuthTemplate;
