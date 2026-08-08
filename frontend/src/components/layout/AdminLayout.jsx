import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-app flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content is pushed right of the fixed sidebar on desktop (w-72 = 18rem) */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-72">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 animate-fade-up p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
