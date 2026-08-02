import HeroButton from "./HeroButton";


export default function Hero() {
    return (
        <div className="text-center">

            <h1 className="text-5xl font-bold text-blue-600">
                PROJECT PRISM
            </h1>

            <p className="mt-4 text-lg text-gray-700">
                Professional Real-time Intelligent Smart Presence Management
            </p>

            <HeroButton />
        </div>
    );
}