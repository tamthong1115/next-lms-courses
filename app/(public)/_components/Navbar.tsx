"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashbaord" },
];

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95
         backdrop-blur-[backdrop-filder]:bg-backround/60"
    >
      <div className="container flex min-h-16 items-center mx-auto">
        <Link href="/" className="flex items-center space-x-2 mr-4">
          <Image src={Logo} alt="logo" className="size-9" />
          <span className="font-bold">LMS Courses.</span>
        </Link>

        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle></ThemeToggle>

            {isPending ? null : session ? (
              <>
                <UserDropdown
                  email={session.user.email}
                  name={session.user.name}
                  image={session.user.image || ""}
                />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "secondary" })}
                >
                  Login
                </Link>
                <Link href="/login" className={buttonVariants()}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
