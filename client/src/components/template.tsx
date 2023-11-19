import * as React from "react";
import LoginModal from "@/components/modals/login.modal";
import { Menu, Button } from 'antd';
import { useLocation } from "wouter";

interface Props {
  children?: React.ReactNode;
}

const Template: React.FC<Props> = ({ children }) => {
    const setLocation = useLocation()[1];
  return (
    <div>
      <div>
        <Menu mode="horizontal" style={{ backgroundColor: 'red', color: 'white', width: '100%' }}>
          <Menu.Item key="home">
          <Button style={{ backgroundColor: 'transparent', color: 'white', border: '0px'}} onClick={() => setLocation("/")}>Home</Button>
          </Menu.Item>  
          <Menu.Item key="explore">
          <Button style={{ backgroundColor: 'transparent', color: 'white', border: '0px'}} onClick={() => setLocation("/explore")}>Explore</Button>
          </Menu.Item>
          <Menu.Item key="createRally">
          <Button style={{ backgroundColor: 'transparent', color: 'white', border: '0px'}} onClick={() => setLocation("/makerally")}>Host a Rally</Button>
          </Menu.Item>  
          <Menu.Item key="login">
            <LoginModal />
          </Menu.Item>
        </Menu>
      </div>

      {children}

      <div>Footer stuff</div>
    </div>
  );
};

export default Template;
