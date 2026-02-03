import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function Header() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = useSelector((state) => state.user.currentUser);

  // console.log('currentUser', currentUser);

  const linkClasses = (href) =>
    `  px-3 py-2 text-sm font-semibold transition-colors ${pathname === href
      ? " text-white bg-[#0e7490]"
      : "text-muted-foreground  hover:text-foreground"
    }`;

  return (
    <header>
      <div
        className={`flex justify-between ${isOpen ? "border-b-0" : "border-b-2"
          } px-4 py-2.5 lg:px-6`}
      >
        <Link
          to="/"
          className="self-center whitespace-nowrap  text-sm md:text-base font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white ">
            Zahid's
          </span>
          Blog
        </Link>
        <form>
          <div className="relative hidden lg:inline-block">
            <Input type="text" placeholder="Search..." className="pr-9" />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </form>

        <Button
          variant="primary"
          size="icon"
          className="lg:hidden border h-10 w-12 cursor-pointer rounded-full"
        >
          <Search className="h-4 w-4" />
        </Button>

        <div className="flex gap-2 md:order-2 items-center">
          {/* Light / Dark mode button */}
          <button
            className="md:flex rounded-full items-center justify-center w-12 h-10 cursor-pointer border bg-white text-black hidden"
            color="gray"
          >
            <Moon />
          </button>

          {currentUser ? <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <img
                src={currentUser.avatar}
                alt="User avatar"
                referrerPolicy="no-referrer"
                className="cursor-pointer w-10 h-10 rounded-full object-cover"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {/* Header Section */}
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">@{currentUser.username}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser.email}
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem><Link to={'/dashboard?tab=profile'}>
                Profile
              </Link></DropdownMenuItem>
              <DropdownMenuItem >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> : <Link to="/sign-in">
            <Button
              variant="outline"
              className="border-2 h-10 border-purple-500 text-black"
            >
              Sign In
            </Button>
          </Link>}

          {/* Hamburger Icon Mobile */}
          <div>
            <button className="md:hidden cursor-pointer border h-10 w-10 flex justify-center items-center">
              <Menu onClick={() => setIsOpen((v) => !v)} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Nav Links - Pc */}
        <nav className="md:flex whitespace-nowrap  gap-1 hidden lg:gap-2">
          <Link to="/" className={linkClasses("/")}>
            Home
          </Link>
          <Link to="/about" className={linkClasses("/about")}>
            About
          </Link>
          <Link to="/projects" className={linkClasses("/projects")}>
            Projects
          </Link>
        </nav>
      </div>

      {/* Nav Links - Mobile */}
      {isOpen && (
        <nav className="border-b-2 [&>a]:block [&>a]:font-medium  flex-col gap-1">
          <Link to="/" className={linkClasses("/")}>
            Home
          </Link>
          <Link to="/about" className={linkClasses("/about")}>
            About
          </Link>
          <Link to="/projects" className={linkClasses("/projects")}>
            Projects
          </Link>
        </nav>
      )}
    </header>
  );
}
