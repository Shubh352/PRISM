"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
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

type Department = {
    id: number;
    department_name: string;
};

type UserModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onUserAdded: () => void;
    user: User | null;
};

export default function UserModal({
    isOpen,
    onClose,
    onUserAdded,
    user,
}: UserModalProps) {

    const [name, setName] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [departmentId, setDepartmentId] = useState<number | "">("");
    const [departments, setDepartments] = useState<Department[]>([]);
    const [semester, setSemester] = useState<number | "">("");
    const [fingerprintId, setFingerprintId] = useState<number | "">("");
    const [userType, setUserType] = useState("Student");

    useEffect(() => {
        async function fetchDepartments() {
            try {
                const response = await api.get("/departments");
                setDepartments(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load departments.");
            }
        }

        if (isOpen) {
            fetchDepartments();
        }
    }, [isOpen]);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setRollNumber(user.roll_number);
            setDepartmentId(user.department_id);
            setSemester(user.semester);
            setFingerprintId(user.fingerprint_id);
            setUserType(user.user_type);
        } else {
            setName("");
            setRollNumber("");
            setDepartmentId("");
            setSemester("");
            setFingerprintId("");
            setUserType("Student");
        }
    }, [user]);

    async function handleSave() {

        if (
            !name.trim() ||
            !rollNumber.trim() ||
            departmentId === ""
        ) {
            toast.error("Please fill all required fields.");
            return;
        }

        if (semester === "" || semester < 1 || semester > 8) {
            toast.error("Semester must be between 1 and 8.");
            return;
        }

        if (fingerprintId === "" || fingerprintId <= 0) {
            toast.error("Fingerprint ID must be greater than 0.");
            return;
        }

        try {

            const payload = {
                name,
                roll_number: rollNumber,
                department_id: departmentId,
                semester,
                fingerprint_id: fingerprintId,
                user_type: userType,
            };

            if (user) {

                await api.put(
                    `/users/${user.id}`,
                    payload
                );

                toast.success(
                    "User updated successfully!"
                );

            } else {

                await api.post(
                    "/users",
                    payload
                );

                toast.success(
                    "User added successfully!"
                );
            }

            onUserAdded();
            onClose();

        } catch (error) {

            console.error(error);

            toast.error(
                "Something went wrong."
            );
        }
    }

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black/50">

            <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-xl">

                <h2 className="mb-6 text-2xl font-bold">
                    {user ? "Edit User" : "Add New User"}
                </h2>

                <div className="space-y-4">

                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full rounded-lg border p-3"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />

                    <input
                        type="text"
                        placeholder="Roll Number"
                        className="w-full rounded-lg border p-3"
                        value={rollNumber}
                        onChange={(e) =>
                            setRollNumber(e.target.value)
                        }
                    />

                    <select
                        className="w-full rounded-lg border p-3"
                        value={departmentId}
                        onChange={(e) =>
                            setDepartmentId(
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                            )
                        }
                    >
                        <option value="">
                            Select Department
                        </option>

                        {departments.map((department) => (
                            <option
                                key={department.id}
                                value={department.id}
                            >
                                {department.department_name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        placeholder="Semester"
                        className="w-full rounded-lg border p-3"
                        value={semester}
                        onChange={(e) =>
                            setSemester(
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                            )
                        }
                    />

                    <input
                        type="number"
                        placeholder="Fingerprint ID"
                        className="w-full rounded-lg border p-3"
                        value={fingerprintId}
                        onChange={(e) =>
                            setFingerprintId(
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                            )
                        }
                    />

                    <select
                        className="w-full rounded-lg border p-3"
                        value={userType}
                        onChange={(e) =>
                            setUserType(e.target.value)
                        }
                    >
                        <option>Student</option>
                        <option>Faculty</option>
                        <option>Admin</option>
                        <option>PhD</option>
                    </select>

                </div>

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="rounded-lg border px-5 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                        {user ? "Update" : "Save"}
                    </button>

                </div>

            </div>

        </div>

    );
}