import React from "react";
import { motion } from "framer-motion";

export default function ResultCard({ result, onReset }) {
  return (
    <motion.div
      className="mt-6 bg-white p-6 rounded-2xl shadow-xl text-center w-full max-w-md"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-indigo-700 mb-2">Prediction Result</h2>
      <p
        className={`text-xl font-semibold ${
          result === "Yes"
            ? "text-red-600"
            : "text-green-600"
        }`}
      >
        {result === "Yes"
          ? "The model predicts a high likelihood of ASD."
          : "The model predicts low likelihood of ASD."}
      </p>
      <button
        onClick={onReset}
        className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
      >
        Try Again
      </button>
    </motion.div>
  );
}
