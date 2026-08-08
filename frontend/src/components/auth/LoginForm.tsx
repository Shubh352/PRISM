"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    User,
    Lock,
    Eye,
    EyeOff,
} from "lucide-react";

import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";

export default function LoginForm() {

    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(
        event: React.FormEvent<HTMLFormElement>
    ) {

        event.preventDefault();

        setError("");

        if (!username.trim() || !password) {
            setError("Please enter your username and password.");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        username: username.trim(),
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Invalid username or password."
                );
            }

            localStorage.setItem(
                "prism_access_token",
                data.access_token
            );

            router.push("/dashboard");

        } catch (error) {

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unable to connect to the PRISM server.");
            }

        } finally {

            setLoading(false);

        }
    }

    return (

        <form
            onSubmit={handleLogin}
            className="space-y-5"
        >

            {/* Username */}

            <Input
                icon={<User size={18} />}
                placeholder="Username"
                value={username}
                onChange={(event) =>
                    setUsername(event.target.value)
                }
                autoComplete="username"
            />

            {/* Password */}

            <Input
                icon={<Lock size={18} />}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(event) =>
                    setPassword(event.target.value)
                }
                autoComplete="current-password"
                rightElement={

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword(!showPassword)
                        }
                        className="text-slate-400 transition hover:text-white"
                    >
                        {showPassword
                            ? <EyeOff size={18} />
                            : <Eye size={18} />
                        }
                    </button>

                }
            />

            {/* Error */}

            {error && (

                <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>

            )}

            {/* Remember Me */}

            <label className="flex items-center gap-2 text-sm text-slate-400">

                <input
                    type="checkbox"
                    className="accent-blue-600"
                />

                Remember Me

            </label>

            {/* Button */}

            <Button
                type="submit"
                disabled={loading}
            >
                {loading ? "Signing In..." : "Sign In"}
            </Button>

        </form>

    );
}