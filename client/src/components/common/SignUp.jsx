import React from "react";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function SignUp() {
  return (
    <div className="flex flex-col  md:flex-row md:items-center p-3 max-w-3xl mx-auto gap-5 min-h-screen mt-20 border-2">
      {/* Left */}
      <div className="flex-1">
        {/* Logo */}
        <Link
          to="/"
          className="self-center whitespace-nowrap  text-4xl  font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white ">
            Zahid's
          </span>
          Blog
        </Link>
        <div>
          <p className="text-sm mt-5">
            Start writing blogs, share knowledge, and join a community of
            readers and writers exploring meaningful content.
          </p>
        </div>
      </div>
      {/* Right */}
      <div className="flex-1">
        <form className="flex flex-col gap-y-6">
          {/* Username */}
          <div className="relative">
            <Input
              className="peer focus:placeholder:text-transparent"
              type="text"
              id="username"
              placeholder="Username"
            />
            <label
              className="hidden peer-focus:block absolute -top-4 left-2 bg-white text-xs px-2 py-1 rounded"
              htmlFor="username"
            >
              Username <span className="text-red-500 font-bold">*</span>
            </label>
          </div>
          {/* Email */}
          <div className="relative">
            <Input
              className="peer focus:placeholder:text-transparent"
              type="email"
              id="email"
              placeholder="abc@example.com"
            />
            <label
              className="hidden peer-focus:block absolute -top-4 left-2 bg-white text-xs px-2 py-1 rounded"
              htmlFor="email"
            >
              Email <span className="text-red-500 font-bold">*</span>
            </label>
          </div>
          {/* Password */}
          <div className="relative">
            <Input
              className="peer focus:placeholder:text-transparent"
              type="Password"
              id="password"
              placeholder="Password"
            />
            <label
              className="hidden peer-focus:block absolute -top-4 left-2 bg-white text-xs px-2 py-1 rounded"
              htmlFor="password"
            >
              Password <span className="text-red-500 font-bold">*</span>
            </label>
          </div>
          <Button size="lg">Sign Up</Button>
          <div className="flex gap-x-2  text-sm">
            <span>Already have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
