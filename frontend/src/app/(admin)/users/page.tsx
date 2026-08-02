"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import AddUserModal from "@/components/users/AddUserModal";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await api.get("/users");
                setUsers(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchUsers();
    }, []);

    return (
        <>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">
                        Users
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Manage registered users
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 transition"
                >
                    + Add User
                </button>
            </div>

            {/* Search Box */}
            <input
                type="text"
                placeholder="Search users..."
                className="mb-6 w-full rounded-lg border p-3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Users Table */}
            <div className="overflow-x-auto rounded-lg bg-white shadow">

                <table className="min-w-full">

                    <thead className="bg-blue-600 text-white">

                        <tr>
                            <th className="px-4 py-3 text-left">Roll No</th>
                            <th className="px-4 py-3 text-left">Name</th>
                            <th className="px-4 py-3 text-left">Department</th>
                            <th className="px-4 py-3 text-left">Semester</th>
                            <th className="px-4 py-3 text-left">Type</th>
                        </tr>

                    </thead>

                    <tbody>

                        {users
                            .filter((user: any) =>
                                user.name.toLowerCase().includes(search.toLowerCase()) ||
                                user.roll_number.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((user: any) => (

                                <tr
                                    key={user.id}
                                    className="border-b hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-3">
                                        {user.roll_number}
                                    </td>

                                    <td className="px-4 py-3">
                                        {user.name}
                                    </td>

                                    <td className="px-4 py-3">
                                        {user.department}
                                    </td>

                                    <td className="px-4 py-3">
                                        {user.semester}
                                    </td>

                                    <td className="px-4 py-3">
                                        {user.user_type}
                                    </td>

                                </tr>

                            ))}

                    </tbody>

                </table>

            </div>
            <AddUserModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
}