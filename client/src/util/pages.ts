import * as T from "@/types";
import Home from "@/pages/home";
import Explore from "@/pages/explore"
import Dashboard from "@/pages/auth/dashboard.main";
import Profile from "@/pages/profile";
import CreateRally from "@/pages/createRally";

export const pages: T.Page[] = [
  {
    title: "Home",
    path: "/",
    onNavBar: true,
    requiresAuth: false,
    component: Home,
  },
  {
    title: "Explore",
    path: "/explore",
    onNavBar: true,
    requiresAuth: true,
    component: Explore
  },
  {
    title: "Create Rally",
    path: "/makerally",
    onNavBar: true,
    requiresAuth: true,
    component: CreateRally
  },
  {
    title: "Dashboard",
    path: "/account/dashboard",
    onNavBar: false,
    requiresAuth: true,
    component: Dashboard
  },
  {
    title: "Profile",
    path: "/profile",
    onNavBar: true,
    requiresAuth: true,
    component: Profile
  }
];
