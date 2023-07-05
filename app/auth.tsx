"use client";

import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export const LoginButton = () => {
  return <button onClick={() => signIn()}>Sign in</button>;
};

export const LogoutButton = () => {
  return <button onClick={() => signOut()}>Sign Out</button>;
};

export const HomeButton = () => {
  return (
    <Link href="/">
      <button>Home</button>
    </Link>
  );
};

export const DashButton = () => {
  return (
    <Link href="/dashboard">
      <button>Dashboard</button>
    </Link>
  );
};
