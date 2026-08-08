import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/auth/AuthGuard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>

            <Navbar />

            <div className="flex">

                <Sidebar />

                <main className="flex-1 p-8">
                    {children}
                </main>

            </div>

        </AuthGuard>
    );
}