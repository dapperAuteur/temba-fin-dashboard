"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/types/common";

const SignUpForm: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitState, setSubmitState] = useState<LoadingState<{ email: string }>>({
    isLoading: false,
    error: null,
    data: null
  });
  // const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState({ isLoading: true, error: null, data: null });

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        setSubmitState({
          isLoading: false,
          error: null,
          data: { email }
        });
        router.push("/api/auth/signin");
      } else {
        const data = await response.json();
        setSubmitState({
          isLoading: false,
          error: new Error(data.message || "Something went wrong"),
          data: null
        });
      }
    } catch (err) {
      console.log("Error:", err);
      setSubmitState({
        isLoading: false,
        error: new Error("An unexpected error occurred"),
        data: null
      });
    }
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="email">Name:</label>
          <input
            type="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {submitState.error && <p className="error">{submitState.error.message}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpForm;
