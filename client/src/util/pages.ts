import * as T from "@/types";
import Home from "@/pages/home";
import Explore from "@/pages/explore"
import Dashboard from "@/pages/auth/dashboard.main";

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
    component: Explore
  },
  {
    title: "Dashboard",
    path: "/account/dashboard",
    onNavBar: false,
    requiresAuth: true,
    component: Dashboard
  }
];
