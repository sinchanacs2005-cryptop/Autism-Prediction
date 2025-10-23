import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Form({ onSubmit }) {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    ethnicity: "",
    jaundice: "",
    family_mem_with_ASD: "",
    country_of_res: "",
    A1: "", A2: "", A3: "", A4: "", A5: "",
    A6: "", A7: "", A8: "", A9: "", A10: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-xl bg-white/90 shadow-2xl rounded-2xl p-6 space-y-4 backdrop-blur"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-2xl font-semibold text-center text-indigo-700 mb-4">
        Fill the details below
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          className="p-2 border rounded-md"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
          className="p-2 border rounded-md"
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          type="text"
          name="ethnicity"
          placeholder="Ethnicity"
          value={formData.ethnicity}
          onChange={handleChange}
          className="p-2 border rounded-md"
        />

        <select
          name="jaundice"
          value={formData.jaundice}
          onChange={handleChange}
          required
          className="p-2 border rounded-md"
        >
          <option value="">Jaundice?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <select
          name="family_mem_with_ASD"
          value={formData.family_mem_with_ASD}
          onChange={handleChange}
          required
          className="p-2 border rounded-md"
        >
          <option value="">Family member with ASD?</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <input
          type="text"
          name="country_of_res"
          placeholder="Country of Residence"
          value={formData.country_of_res}
          onChange={handleChange}
          className="p-2 border rounded-md"
        />
      </div>

      <h3 className="text-lg font-semibold text-indigo-600 mt-4">Answer Questions (A1–A10)</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <select
            key={i}
            name={`A${i + 1}`}
            value={formData[`A${i + 1}`]}
            onChange={handleChange}
            required
            className="p-2 border rounded-md text-center"
          >
            <option value="">A{i + 1}</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        ))}
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full bg-indigo-600 text-white p-2 rounded-lg mt-4 font-semibold hover:bg-indigo-700 transition"
      >
        Predict ASD
      </motion.button>
    </motion.form>
  );
}



