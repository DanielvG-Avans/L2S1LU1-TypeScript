"use client";

import { Link, useNavigate } from "react-router-dom";

export default function NotFound(): React.ReactNode {
  const navigate = useNavigate();

  return (
    <main
      role="main"
      aria-labelledby="notfound-title"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 text-white p-6"
    >
      <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 backdrop-blur-sm flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 flex items-center justify-center">
          {/* Simple, lightweight illustrative SVG */}
          <svg
            width="220"
            height="160"
            viewBox="0 0 220 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="opacity-95"
          >
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
                <stop offset="1" stopColor="#ffd1ea" stopOpacity="0.95" />
              </linearGradient>
            </defs>

            <rect
              x="8"
              y="12"
              width="204"
              height="116"
              rx="20"
              fill="url(#g1)"
              fillOpacity="0.06"
            />
            <g
              transform="translate(30,18)"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.95"
            >
              <path d="M20 80C20 80 36 28 92 28C148 28 164 80 164 80" className="text-white/30" />
              <text
                x="56"
                y="76"
                fill="currentColor"
                fontWeight="800"
                fontSize="48"
                className="text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-200"
              >
                404
              </text>
            </g>
          </svg>
        </div>

        <section className="flex-1 text-center md:text-left" aria-live="polite">
          <h1
            id="notfound-title"
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-none"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200">
              404
            </span>
          </h1>

          <h2 className="mt-3 text-2xl sm:text-3xl font-semibold">Page not found</h2>

          <p className="mt-2 text-white/80 max-w-xl">
            The page you’re looking for doesn’t exist or has moved. You can go back to the previous
            page, return home, or contact support if you need help.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 justify-center md:justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition"
            >
              Go back
            </button>

            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition"
            >
              Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
