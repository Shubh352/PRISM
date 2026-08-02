export default function Sidebar() {
    return (
        <aside className="w-64 bg-white border-r shadow-sm p-6">

            <h2 className="text-lg font-bold mb-6">
                Navigation
            </h2>

            <ul className="space-y-4">

                <li className="cursor-pointer hover:text-blue-600">
                    Dashboard
                </li>

                <li className="cursor-pointer hover:text-blue-600">
                    Users
                </li>

                <li className="cursor-pointer hover:text-blue-600">
                    Attendance
                </li>

                <li className="cursor-pointer hover:text-blue-600">
                    Reports
                </li>

            </ul>

        </aside>
    );
}