import { Suspense } from "react";
import { ModuleList } from "@/components/Module/ModuleList";

const HomePage = () => {
  return (
    <div className="p-6 mx-auto container">
      <h1 className="text-2xl font-semibold mb-6">Available Modules</h1>
      <Suspense fallback={<div>Loading modules...</div>}>
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <ModuleList />
        </div>
      </Suspense>
    </div>
  );
};

export default HomePage;
