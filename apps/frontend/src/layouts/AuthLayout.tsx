import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <main
      className="w-[100dvw] h-[100dvh] flex items-center justify-center p-6 bg-[#323333ff] bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://www.avans.nl/binaries/_ht_1675236669544/ultrawideXL1/content/gallery/nextweb/nieuws/2023/02/openxbuitenaanzicht.jpg")',
        backgroundBlendMode: "overlay",
      }}>
      <Outlet />
    </main>
  );
};
