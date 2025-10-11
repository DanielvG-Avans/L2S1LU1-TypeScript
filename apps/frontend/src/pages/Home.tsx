const HomePage = () => {
  return (
    <div className="p-6 mx-auto container">
      <h1 className="text-3xl font-bold underline mb-6">Modules Grid</h1>

      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 18 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between border rounded-lg p-4 shadow-sm hover:shadow-md transition-colors bg-white"
            role="article"
            aria-label={`Module ${idx + 1}`}>
            <div>
              <div className="text-xs text-gray-500">Module {idx + 1}</div>
              <h2 className="mt-2 text-lg font-semibold">
                Module Title {idx + 1}
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Short description or progress info for this module.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span
                className={`text-xs ${idx % 2 ? "text-red-500" : "text-green-500"}`}>
                Status: {idx % 2 ? "Not started" : "Started"}
              </span>
              <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
