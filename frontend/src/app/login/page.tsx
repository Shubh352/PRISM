import LoginHero from "@/components/auth/LoginHero";
import LoginCard from "@/components/auth/LoginCard";

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-slate-950">

            <div className="grid min-h-screen lg:grid-cols-2">

                {/* Left Side */}

                <LoginHero />

                {/* Right Side */}

                <div className="flex items-center justify-center p-8">

                    <LoginCard />

                </div>

            </div>

        </main>
    );
}