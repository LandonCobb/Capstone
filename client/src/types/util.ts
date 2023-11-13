import * as React from "react"

export interface Page {
    title: string;
    path: string;
    onNavBar: boolean;
    requiresAuth: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.ComponentType<React.ComponentProps<any>>
}