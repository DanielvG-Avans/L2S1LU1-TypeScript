import { useState } from "react";
import { fetchBackend } from "../lib/fetch";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [SuccessMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      const loginResponse = await fetchBackend("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) {
        setErrorMessage("Error man!");
        return;
      }

      const loginData = loginResponse.json();
      if (!loginData) {
        setErrorMessage("Backend Error man!");
        return;
      }

      setSuccessMessage("Login successfull!");
      return setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: unknown) {
      setErrorMessage(`${err}`);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#debeff] text-gray-900 backdrop-blur-md rounded-2xl shadow-2xl p-8">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Welcome</h1>
        <p className="text-sm text-gray-700 mt-1">Sign in to continue to Avans Keuzekompas</p>
      </header>

      <form className="space-y-4" aria-label="Login form" onSubmit={handleLogin}>
        <div className="relative">
          <label htmlFor="emailInput" className="">
            Email
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12l-4-4-4 4m8 0l-4 4-4-4"
              />
            </svg>
          </div>
          <input
            id="emailInput"
            name="email"
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 placeholder-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition"
            aria-describedby="email-note"
          />
          <p id="email-note" className="sr-only">
            Enter your email address
          </p>
        </div>
        <div className="relative">
          <label htmlFor="passwordInput" className="">
            Password
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 11v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6"
              />
            </svg>
          </div>
          <input
            id="passwordInput"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 placeholder-gray-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition"
          />
        </div>

        <div className="space-y-3 mt-2">
          {errorMessage && (
            <div
              role="alert"
              aria-live="assertive"
              className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg shadow-sm"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M5.07 19a9 9 0 1113.86 0L12 21l-6.93-2z"
                />
              </svg>
              <div className="text-sm">{errorMessage}</div>
            </div>
          )}

          {SuccessMessage && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-start gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-lg shadow-sm"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div className="text-sm">{SuccessMessage}</div>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium shadow hover:scale-[1.01] transform transition cursor-pointer"
        >
          Sign in
        </button>
      </form>
    </div>
  );
};

export default Login;
