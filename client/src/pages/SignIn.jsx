import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "@/components/common/OAuth.jsx";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return dispatch(signInFailure("Please fillout all fields."));
    }

    const payload = {
      email,
      password,
    };

    try {
      dispatch(signInStart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      // console.log("data", data);

      if (data.success == false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      // For catching errors on client side like no-internet problem
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="md:flex md:flex-row md:items-center p-3 max-w-3xl mx-auto gap-5 min-h-screen">
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
      <div className="flex-1 mt-5 md:mt-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
          {/* Email */}
          <div className="relative">
            <Input
              className="peer focus:placeholder:text-transparent"
              type="email"
              id="email"
              placeholder="abc@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
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
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
            />
            <label
              className="hidden peer-focus:block absolute -top-4 left-2 bg-white text-xs px-2 py-1 rounded"
              htmlFor="password"
            >
              Password <span className="text-red-500 font-bold">*</span>
            </label>
          </div>

          <Button size="lg" disabled={loading}>
            {loading ? (
              <>
                <Spinner /> <span>Signing In...</span>
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          <OAuth />

          <div className="flex gap-x-2  text-sm">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </form>

        {errorMessage && (
          <Alert className="mt-5" variant="destructive">
            <AlertCircleIcon />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
