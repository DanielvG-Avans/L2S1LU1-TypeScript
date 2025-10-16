import React from "react";

export interface ErrorStateProps {
  loading?: boolean;
  error?: string | Error | null;
  itemsCount?: number; // if provided and === 0 -> empty state
  loadingTitle?: string;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyMessage?: string;
  className?: string;
  children?: React.ReactNode; // content to render when no state (not loading/error/empty)
}

export default function ErrorState({
  loading = false,
  error = null,
  itemsCount,
  loadingTitle = "Laden…",
  loadingMessage = "Even geduld aub",
  emptyTitle = "Geen modules gevonden",
  emptyMessage = "Er zijn nog geen modules beschikbaar.",
  className = "",
  children,
}: ErrorStateProps) {
  if (loading) {
    return (
      <div className={`flex items-center justify-center h-48 ${className}`}>
        <div className="bg-white/5 p-6 rounded-lg shadow flex items-center gap-4">
          <div
            className="w-6 h-6 border-2 border-t-2 border-gray-300 rounded-full animate-spin"
            aria-hidden="true"
          />
          <div>
            <div className="text-gray-100 font-medium">{loadingTitle}</div>
            <div className="text-sm text-gray-400">{loadingMessage}</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    const message =
      typeof error === "string" ? error : (error && (error as Error).message) || String(error);
    return (
      <div className={`flex items-center justify-center h-48 ${className}`}>
        <div className="w-full max-w-md bg-red-50 border border-red-200 p-4 rounded-lg shadow">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-red-600"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 9v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                stroke="currentColor"
                strokeWidth="0"
                fill="currentColor"
              />
            </svg>
            <div className="flex-1">
              <div className="text-red-800 font-medium">Fout bij laden</div>
              <div className="text-sm text-red-600 mt-1">{message}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (typeof itemsCount === "number" && itemsCount === 0) {
    return (
      <div className={`flex items-center justify-center h-48 ${className}`}>
        <div className="w-full max-w-md bg-white/5 border border-gray-200 p-6 rounded-lg text-center shadow">
          <svg
            className="mx-auto w-10 h-10 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 13h8M8 9h8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-3 text-gray-100 font-medium">{emptyTitle}</div>
          <div className="mt-2 text-sm text-gray-400">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return <>{children ?? null}</>;
}
