"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import UserModal from "@/components/users/UserModal";
import toast from "react-hot-toast";

type User = {
    id: number;
    name: string;
    roll_number: string;
    department: string;
    department_id: number;
    semester: number;
    fingerprint_id: number;
    user_type: string;
};

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchUsers() {
        setLoading(true);

        try {
            const response = await api.get("/users");
            setUsers(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch users.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    async function handleDelete(user: User) {
        const confirmed = window.confirm(
            `Delete ${user.name}?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/users/${user.id}`);

            toast.success("User deleted successfully!");

            fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete user.");
        }
    }

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.roll_number.toLowerCase().includes(search.toLowerCase())
    );

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
                    onClick={() => {
                        setSelectedUser(null);
                        setShowModal(true);
                    }}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                    + Add User
                </button>
            </div>

            {/* Search */}
            <input
                type="text"
                placeholder="Search users..."
                className="mb-6 w-full rounded-lg border p-3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Loading */}
            {loading ? (
                <div className="rounded-lg bg-white p-8 text-center shadow">
                    Loading users...
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg bg-white shadow">
                    <table className="min-w-full">

                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left">
                                    Roll No
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Name
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Department
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Semester
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Type
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="py-8 text-center text-gray-500"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b transition hover:bg-gray-50"
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

                                        <td className="flex gap-2 px-4 py-3">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowModal(true);
                                                }}
                                                className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(user)
                                                }
                                                className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <UserModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedUser(null);
                }}
                onUserAdded={fetchUsers}
                user={selectedUser}
            />
        </>
    );
}