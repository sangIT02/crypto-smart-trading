import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#05080D] text-white">
      <div className="flex min-h-screen">
        <AdminHeader />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminSidebar />

          <main className="flex-1 overflow-auto bg-[radial-gradient(circle_at_top,_rgba(240,185,11,0.08),_transparent_24%),linear-gradient(180deg,#0B0E11_0%,#11151C_100%)] p-4 md:p-6">
            <div className="mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
