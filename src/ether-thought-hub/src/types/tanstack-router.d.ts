import React from "react";

declare module "@tanstack/react-router" {
  export function createFileRoute(path: string): (options?: any) => {
    useParams: () => Record<string, string>;
    options?: any;
    component?: any;
  };

  export function createRootRouteWithContext<T = any>(context?: any): (options?: any) => any;
  export function createRouter(options: any): any;
  export function useRouter(): any;

  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to?: string;
    params?: Record<string, any>;
    search?: Record<string, any>;
    children?: React.ReactNode;
    className?: string;
    activeProps?: Record<string, any>;
  }

  export const Link: React.FC<LinkProps>;
  export const Outlet: React.FC<any>;
  export const HeadContent: React.FC<any>;
  export const Scripts: React.FC<any>;
  export const ClientOnly: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }>;
}
