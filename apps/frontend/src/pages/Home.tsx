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
            <div>
              <div className="flex items-center mt-3">
                <button
                  type="button"
                  className="text-sm px-3 py-1 rounded transition-colors hover:bg-gray-100 flex items-center gap-2"
                  data-fav={
                    typeof window !== "undefined" &&
                    localStorage.getItem(`module_fav_${idx}`)
                      ? "true"
                      : "false"
                  }
                  aria-pressed={
                    typeof window !== "undefined" &&
                    localStorage.getItem(`module_fav_${idx}`)
                      ? "true"
                      : "false"
                  }
                  onClick={(e) => {
                    const btn = e.currentTarget as HTMLButtonElement;
                    const key = `module_fav_${idx}`;
                    const currentlyFav =
                      btn.getAttribute("data-fav") === "true";
                    const nextFav = !currentlyFav;

                    // persist
                    if (nextFav) localStorage.setItem(key, "1");
                    else localStorage.removeItem(key);

                    // reflect in attributes and classes
                    btn.setAttribute("data-fav", String(nextFav));
                    btn.setAttribute("aria-pressed", String(nextFav));
                    btn.classList.toggle("text-yellow-500", nextFav);

                    // update visible text (keeps UI responsive without hooks)
                    const star = nextFav ? "★" : "☆";
                    btn.querySelector(".fav-star")!.textContent = star;
                    btn.querySelector(".fav-label")!.textContent = nextFav
                      ? "Favorited"
                      : "Favorite";
                  }}>
                  <span
                    className={`fav-star ${typeof window !== "undefined" && localStorage.getItem(`module_fav_${idx}`) ? "text-yellow-500" : ""}`}>
                    {typeof window !== "undefined" &&
                    localStorage.getItem(`module_fav_${idx}`)
                      ? "★"
                      : "☆"}
                  </span>
                  <span className="fav-label ml-1">
                    {typeof window !== "undefined" &&
                    localStorage.getItem(`module_fav_${idx}`)
                      ? "Favorited"
                      : "Favorite"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
