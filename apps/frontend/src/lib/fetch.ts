interface fetchResponse {
  ok: boolean;
  status: number;
  statusText: string;
  json: () => Promise<unknown>;
}

export const fetchBackend = async (
  path: string,
  options: RequestInit = {}
): Promise<fetchResponse> => {
  const url = import.meta.env.VITE_BACKEND_URL;
  if (!url) {
    throw new Error("BACKEND_URL is not defined");
  }

  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // Include cookies for authentication
  });

  return response;
};
