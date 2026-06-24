import React, { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage({
  onLoginSuccess,
  goToRegister,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (
      storedUser &&
      storedUser.email === email &&
      storedUser.password === password
    ) {
      localStorage.setItem("isLoggedIn", "true");
      onLoginSuccess();
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <motion.div
        className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          Autism Prediction AI
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Login to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border p-3 rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg"
          >
            Login
          </button>

          <button
            type="button"
            onClick={goToRegister}
            className="w-full text-indigo-600"
          >
            Create New Account
          </button>
        </form>
      </motion.div>
    </div>
  );
}