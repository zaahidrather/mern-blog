import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage(null);

    if (!username || !email || !password) {
      return setErrorMessage("Please fillout all fields.");
    }

    const payload = {
      username,
      email,
      password,
    };

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Response", res);
      console.log("Data", data);

      if (data.success == false) {
        return setErrorMessage(data.message);
      }
      if (res.ok) {
        navigate("/sign-in");
      }
    } catch (error) {
      // For catching errors on client side like no-internet problem
      return setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col  md:flex-row md:items-center p-3 max-w-3xl mx-auto gap-5 min-h-screen mt-10">
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-y-6">
          {/* Username */}
          <div className="relative">
            <Input
              className="peer focus:placeholder:text-transparent"
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
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
              placeholder="Password"
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
                <Spinner /> <span>Signing Up...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </Button>

          <div className="flex gap-x-2  text-sm">
            <span>Already have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Log In
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
