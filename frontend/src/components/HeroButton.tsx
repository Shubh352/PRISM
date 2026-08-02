import Link from "next/link";

export default function HeroButton() {
    return (
        <Link
            href="/dashboard"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
        >
            Admin Dashboard
        </Link>
    );
}