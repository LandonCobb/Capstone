import * as React from "react";
import { Menu, Button, Layout } from "antd";
import { useLocation } from "wouter";
import { Auth } from "aws-amplify";
import AppContext from "@/context/app.context";
import Logo from "@/components/logo";

interface Props {
  children?: React.ReactNode;
}

const AuthTemplate: React.FC<Props> = ({ children }) => {
  const buttonStyle = {
    backgroundColor: "transparent",
    color: "white",
    border: "0px",
    boxShadow: "none",
  };


  const appContext = React.useContext(AppContext)!;
  const setLocation = useLocation()[1];

  const logout = async () => {
    await Auth.signOut();
    appContext.refreshUser();
    setLocation("/");
  };

  return (
    <Layout style={{height: "100vh"}}>
      <Layout.Header style={{ background: "red", height: "auto" }}>
        <div
          className="flex center"
          style={{ backgroundColor: "red", color: "white" }}
        >
          <Logo/>
          {/* LOGO GOES HERE; NOT IN THE MENU ELEMENET */}
          <Menu
            mode="horizontal"
            style={{ backgroundColor: "red", color: "white", width: "100%", borderBottom: "none" }}
          >
            <Menu.Item key="home">
              <Button
                style={buttonStyle}
                onClick={() => setLocation("/")}
              >
                Home
              </Button>
            </Menu.Item>
            <Menu.Item key="explore">
              <Button
                style={buttonStyle}
                onClick={() => setLocation("/explore")}
              >
                Explore
              </Button>
            </Menu.Item>
            <Menu.Item key="createRally">
              <Button
                style={buttonStyle}
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
      <Layout.Content style={{ margin: "20px", height: "auto" }}>{children}</Layout.Content>

      <Layout.Footer>
        Rally | Created by Landon Cobb
      </Layout.Footer>
      <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 0,
            height: 0,
            borderLeft: "500px solid transparent",
            borderBottom: "500px solid red", // Change 'red' to the desired color
          }}
        />
    </Layout>
  );
};

export default AuthTemplate;
