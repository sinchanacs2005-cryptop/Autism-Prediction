import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- Inline SVG Icons (Replacing react-icons/fi) ---

const SVG_PROPS = {
    xmlns: "http://www.w3.org/2000/svg",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
};

// FiUsers equivalent
const UsersIcon = ({ className, ...props }) => (
    <svg {...SVG_PROPS} className={className} {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><path d="M20 8v6M23 11h-6" />
    </svg>
);

// FiCheckCircle equivalent
const CheckCircleIcon = ({ className, ...props }) => (
    <svg {...SVG_PROPS} className={className} {...props}>
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" />
    </svg>
);

// FiAlertCircle equivalent
const AlertCircleIcon = ({ className, ...props }) => (
    <svg {...SVG_PROPS} className={className} {...props}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

// FiMessageSquare equivalent
const MessageSquareIcon = ({ className, ...props }) => (
    <svg {...SVG_PROPS} className={className} {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

// FiLoader equivalent
const LoaderIcon = ({ className = 'animate-spin', ...props }) => (
    <svg {...SVG_PROPS} className={className} {...props}>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
);

// --- Utility Components (Navbar, Footer) ---

const Navbar = () => (
    <header className="w-full bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">

            <div className="flex items-center space-x-2">
                <UsersIcon className="text-indigo-600 w-6 h-6" />
                <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                    ASD Spectrum Screener
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 hidden sm:block">
                    AI-Powered Preliminary Assessment
                </span>

                <button
                    onClick={() => {
                        localStorage.removeItem("isLoggedIn");
                        window.location.reload();
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

        </div>
    </header>
);

const Footer = () => (
    <footer className="w-full bg-gray-800 text-white mt-12 p-4 text-center">
        <div className="max-w-7xl mx-auto">
            <p className="text-xs text-gray-400">
                **Disclaimer:** This tool provides a predictive model result and is not a substitute for professional medical diagnosis. Consult a qualified healthcare professional for any medical concerns.
            </p>
            <p className="mt-2 text-sm">&copy; {new Date().getFullYear()}Developed by Sinchana C S | Autism Spectrum Disorder Prediction Using Machine Learning </p>
        </div>
    </footer>
);

// --- Result Display Component ---

const ResultCard = ({ result, onReset }) => {
    // The result from the backend is the 'label' string (e.g., "Autism Spectrum Disorder Detected")
    const label = result.label;
    const confidence = Math.round(result.confidence * 100);

    const isPositive =
        label === "Autism Spectrum Disorder Detected"; 
    const icon = isPositive ? (
        <AlertCircleIcon className="w-12 h-12 text-red-500" />
    ) : (
        <CheckCircleIcon className="w-12 h-12 text-green-500" />
    );
    const title = isPositive ? "High Likelihood Indicated" : "Low Likelihood Indicated";
    const message = isPositive 
        ? "The model suggests a potential association with ASD traits based on the provided inputs. Please consult a specialist."
        : "The model suggests a low likelihood of ASD traits based on the provided inputs.";
    const ringColor = isPositive ? 'ring-red-400' : 'ring-green-400';

    return (
        <motion.div
            className={`mt-6 bg-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-md ring-4 ${ringColor}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
            <div className="flex justify-center mb-4">{icon}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                <div
                    className={`h-4 rounded-full ${
                    isPositive ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{ width: `${confidence}%` }}
                />
                </div>

                <p className="mt-2 text-sm text-gray-600">Confidence: {confidence}%</p>
                <div className="mt-4 p-4 rounded-xl bg-gray-50">
                    <p className="text-sm text-gray-500">
                        Prediction Result
                    </p>

                    <p className={`text-xl font-bold ${
                        isPositive ? "text-red-600" : "text-green-600"
                    }`}>
                        {label}
                    </p>
                </div>
            <p className="text-sm text-gray-600 mb-6">{message}</p>
            <motion.button
                onClick={onReset}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition"
            >
                Start New Assessment
            </motion.button>
        </motion.div>
    );
};

// --- Form Component ---

const Form = ({ onSubmit, isLoading }) => {
    // Ensure all required fields from the Payload model are present
    const initialFormData = {
        age: "", gender: "", ethnicity: "", jaundice: "", 
        contry_of_res: "", autism: "", used_app_before: "", relation: "",
        A1_Score: "", A2_Score: "", A3_Score: "", A4_Score: "", A5_Score: "",
        A6_Score: "", A7_Score: "", A8_Score: "", A9_Score: "", A10_Score: "",
    };
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const questionDescriptions = [
        "Notices details that others miss?", "Finds social interactions challenging?",
        "Prefers routine over spontaneity?", "Has trouble reading non-verbal cues?",
        "Engages in repetitive behaviors?", "Has difficulty maintaining eye contact?",
        "Shows intense focus on specific topics?", "Avoids large crowds or noise?",
        "Difficulty understanding sarcasm?", "Reacts strongly to sensory input?"
    ];

    const demographicFields = [
        { name: "age", type: "number", placeholder: "Age (Years)", required: true },
    ];
    

    const selectFields = [
        { name: "gender", options: ["Male", "Female"], label: "Gender", required: true },
        { name: "jaundice", options: ["Yes", "No"], label: "History of Jaundice?", required: true },
        { name: "autism", options: ["Yes", "No"], label: "Family member with ASD?", required: true },
        { name: "used_app_before", options: ["Yes", "No"], label: "Used app before?", required: true },
        { name: "relation", options: ["Self", "Parent", "Health professional", "Relative", "Others"], label: "Relation", required: true },
        { 
            name: "ethnicity", 
            options: ["White-European", "Asian", "Middle Eastern", "Black", "Latino", "Others"], 
            label: "Ethnicity", 
            required: true 
        },
        { 
            name: "contry_of_res", 
            options: ["United States", "United Kingdom", "India", "Canada", "Australia", "Europe", "Other"], 
            label: "Country of Residence", 
            required: true 
        },
    ];

    // Check if ALL required fields (age, all select fields, and all A_Score fields) are filled
    const isFormValid = (
        formData.age !== "" &&
        selectFields.every(f => formData[f.name] !== "") &&
        Array.from({ length: 10 }).every((_, i) => formData[`A${i + 1}_Score`] !== "")
    );


    return (
        <motion.form
            onSubmit={handleSubmit}
            className="w-full max-w-4xl bg-white/95 shadow-3xl rounded-3xl p-8 space-y-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h2 className="text-3xl font-extrabold text-center text-indigo-700">
                User Information & Screening
            </h2>

            {/* --- Demographic Section --- */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-600 border-b pb-2 flex items-center">
                    <UsersIcon className="mr-2 text-indigo-500 w-5 h-5" /> Demographic Details (All Required)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Render Age input */}
                    {demographicFields.map((field) => (
                        <input
                            key={field.name}
                            type={field.type}
                            name={field.name}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required={field.required}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-150"
                        />
                    ))}

                    {/* Render all Select fields */}
                    {selectFields.map((field) => (
                        <select
                            key={field.name}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            required={field.required}
                            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none bg-white transition duration-150"
                        >
                            <option value="" disabled>{field.label}</option>
                            {field.options.map(opt => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    ))}
                </div>
            </section>

            {/* --- Questionnaire Section (A1-A10) --- */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-600 border-b pb-2 flex items-center">
                    <MessageSquareIcon className="mr-2 text-indigo-500 w-5 h-5" /> Behavioral Assessment (A1-A10)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {Array.from({ length: 10 }).map((_, i) => {
                        const qNum = i + 1;
                        const qName = `A${qNum}_Score`; // CRITICAL: Use correct name for backend Payload
                        return (
                            <div key={qNum} className="flex items-center space-x-4 p-2 bg-gray-50 rounded-lg">
                                <label className="text-sm font-medium text-gray-700 flex-grow">
                                    A{qNum}: {questionDescriptions[i]}
                                </label>
                                <select
                                    name={qName}
                                    value={formData[qName]}
                                    onChange={handleChange}
                                    required
                                    className="p-2 border border-gray-300 rounded-lg text-center text-sm w-20 focus:ring-indigo-500 transition duration-150"
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        );
                    })}
                </div>
            </section>

            <motion.button
                type="submit"
                disabled={isLoading || !isFormValid}
                whileHover={{ scale: isLoading || !isFormValid ? 1 : 1.02 }}
                whileTap={{ scale: isLoading || !isFormValid ? 1 : 0.98 }}
                className={`w-full p-3 rounded-xl font-bold text-lg transition-all duration-300 
                    ${isLoading || !isFormValid
                        ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                    }`}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center">
                        <LoaderIcon className="animate-spin mr-2 w-5 h-5" /> Processing Prediction...
                    </span>
                ) : (
                    'Run Prediction Model'
                )}
            </motion.button>
        </motion.form>
    );
};

// --- Main App Component ---

export default function App() {
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [page, setPage] = useState("register");

    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );
    // Moved apiUrl definition to the component scope to be accessible by renderContent
    const apiUrl = "http://127.0.0.1:8000/api/predict"; // CRITICAL FIX: Correct endpoint path

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setIsError(false);
        setResult(null);

        // Map the form data keys/values to the backend Payload requirements
        const payload = {
            age: parseInt(data.age), // Convert age to integer
            gender: data.gender,
            ethnicity: data.ethnicity,
            jaundice: data.jaundice,
            contry_of_res: data.contry_of_res,
            autism: data.autism, 
            used_app_before: data.used_app_before,
            relation: data.relation,
            A1_Score: parseInt(data.A1_Score), // Convert score strings to integers
            A2_Score: parseInt(data.A2_Score),
            A3_Score: parseInt(data.A3_Score),
            A4_Score: parseInt(data.A4_Score),
            A5_Score: parseInt(data.A5_Score),
            A6_Score: parseInt(data.A6_Score),
            A7_Score: parseInt(data.A7_Score),
            A8_Score: parseInt(data.A8_Score),
            A9_Score: parseInt(data.A9_Score),
            A10_Score: parseInt(data.A10_Score),
        };

        const maxRetries = 1; 

        for (let i = 0; i < maxRetries; i++) {
            try {
                const res = await fetch(apiUrl, { // Use apiUrl from component scope
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    // This handles 404, 422, 500 errors from the server
                  //  const errorJson = await res.json();
                  //  console.error("Server Error Response:", errorJson);
                  //  throw new Error(`Server returned error status: ${res.status}. Detail: ${JSON.stringify(errorJson)}`);
                }

                const json = await res.json();
                
                // CRITICAL FIX: Check for the 'label' key from your backend response
                if (json && json.label) {
                    setResult(json); 
                    setIsLoading(false);
                    return; // Success, exit function
                } else {
                    throw new Error("Invalid response format from server.");
                }

            } catch (error) {
                console.error(`API call failed:`, error);
                
                // Only set error state after final failure
                if (i === maxRetries - 1) {
                    setIsError(true);
                }
            }
        }

        setIsLoading(false);
    };

    const handleReset = () => {
        setResult(null);
        setIsError(false);
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <motion.div
                    className="mt-10 p-8 bg-indigo-50 rounded-xl shadow-lg text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <LoaderIcon className="animate-spin mx-auto w-10 h-10 text-indigo-600 mb-4" />
                    <p className="text-xl font-medium text-indigo-700">Analyzing data...</p>
                    <p className="text-sm text-gray-500 mt-1">Connecting to ML server ({apiUrl})</p> {/* Use apiUrl from component scope */}
                </motion.div>
            );
        }

        if (isError) {
            return (
                <motion.div
                    className="mt-10 p-8 bg-red-100 rounded-xl shadow-lg text-center w-full max-w-md"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <AlertCircleIcon className="mx-auto w-10 h-10 text-red-600 mb-4" />
                    <h2 className="text-2xl font-bold text-red-800 mb-2">Connection Error</h2>
                    <p className="text-md text-red-700 mb-6">Could not connect to the FastAPI backend. Please ensure the server is running at {apiUrl} and check the browser console for details.</p> {/* Use apiUrl from component scope */}
                    <motion.button
                        onClick={handleReset}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition"
                    >
                        Dismiss
                    </motion.button>
                </motion.div>
            );
        }

        if (result) {
            return <ResultCard result={result} onReset={handleReset} />;
        }

        return <Form onSubmit={handleSubmit} isLoading={isLoading} />;
    };

    if (!isLoggedIn) {

        if (page === "register") {
            return (
            <RegisterPage
                onRegisterSuccess={() =>
                setPage("login")
                }
            />
            );
        }

        return (
            <LoginPage
            onLoginSuccess={() =>
                setIsLoggedIn(true)
            }
            goToRegister={() =>
                setPage("register")
            }
            />
        );
    }
    return (
        <div className="flex flex-col min-h-screen font-inter">
            <Navbar />

            <main className="flex flex-col items-center flex-grow p-4 pt-12">

            {/* Hero Section */}
            <motion.div
                className="text-center max-w-4xl mb-12"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-800 mb-4">
                Autism Spectrum Disorder Prediction
                </h1>

                <p className="text-lg text-gray-700 leading-relaxed px-4">
                AI-powered screening system designed to assist in identifying
                Autism Spectrum Disorder traits through behavioral assessment
                and machine learning analysis.
                </p>
            </motion.div>
            {/* Awareness Banner */}
            <div className="bg-white rounded-2xl shadow-md p-4 mb-8 max-w-4xl w-full">
                <p className="text-gray-700 text-center">
                    🧩 Early screening can help identify developmental needs and
                    support timely intervention. This tool is intended for educational
                    and preliminary assessment purposes only.
                </p>
            </div>
            {/* Feature Cards */}
            {!result && !isLoading && (
                <div className="grid md:grid-cols-3 gap-6 mb-10 max-w-6xl w-full px-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                    <h3 className="font-bold text-indigo-700 text-lg mb-2">
                    🤖 Machine Learning
                    </h3>
                    <p className="text-gray-600">
                    Uses trained ASD prediction models to analyze behavioral patterns.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                    <h3 className="font-bold text-indigo-700 text-lg mb-2">
                    ⚡ Fast Screening
                    </h3>
                    <p className="text-gray-600">
                    Complete the assessment within a few minutes.
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
                    <h3 className="font-bold text-indigo-700 text-lg mb-2">
                    📊 Confidence Results
                    </h3>
                    <p className="text-gray-600">
                    Provides prediction outcomes with confidence indicators.
                    </p>
                </div>
                </div>
            )}

            {renderContent()}

            </main>

            <Footer />

            <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

            .font-inter {
                font-family: 'Inter', sans-serif;
            }

            body {
                background: linear-gradient(
                135deg,
                #f8fafc 0%,
                #dbeafe 50%,
                #eef2ff 100%
                );
            }
            `}</style>

        </div>
    );
}