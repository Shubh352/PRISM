"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

type Department = {
    id: number;
    department_name: string;
};

type DeviceModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onDeviceAdded: () => void;
};

export default function DeviceModal({
    isOpen,
    onClose,
    onDeviceAdded,
}: DeviceModalProps) {

    const [deviceName, setDeviceName] = useState("");
    const [deviceCode, setDeviceCode] = useState("");
    const [departmentId, setDepartmentId] = useState<number | "">("");
    const [location, setLocation] = useState("");
    const [firmwareVersion, setFirmwareVersion] = useState("");

    const [departments, setDepartments] = useState<Department[]>([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [saving, setSaving] = useState(false);


    useEffect(() => {

        if (!isOpen) return;

        async function fetchDepartments() {

            setLoadingDepartments(true);

            try {

                const response =
                    await api.get("/departments");

                setDepartments(response.data);

            } catch (error) {

                console.error(error);

                toast.error(
                    "Failed to fetch departments."
                );

            } finally {

                setLoadingDepartments(false);

            }
        }

        fetchDepartments();

    }, [isOpen]);


    function resetForm() {

        setDeviceName("");
        setDeviceCode("");
        setDepartmentId("");
        setLocation("");
        setFirmwareVersion("");

    }


    async function handleSave() {

        if (!deviceName.trim()) {

            toast.error(
                "Device name is required."
            );

            return;
        }

        if (!deviceCode.trim()) {

            toast.error(
                "Device code is required."
            );

            return;
        }

        if (departmentId === "") {

            toast.error(
                "Please select a department."
            );

            return;
        }

        if (!location.trim()) {

            toast.error(
                "Location is required."
            );

            return;
        }


        setSaving(true);

        try {

            await api.post("/devices", {

                device_name: deviceName.trim(),

                device_code: deviceCode.trim(),

                department_id: departmentId,

                location: location.trim(),

                firmware_version:
                    firmwareVersion.trim() || null,

            });


            toast.success(
                "Device added successfully!"
            );

            resetForm();

            onDeviceAdded();

            onClose();

        } catch (error: any) {

            console.error(error);

            const message =
                error?.response?.data?.detail;

            toast.error(
                message || "Failed to add device."
            );

        } finally {

            setSaving(false);

        }

    }


    if (!isOpen) return null;


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-xl">

                <h2 className="mb-6 text-2xl font-bold">
                    Add New Device
                </h2>


                <div className="space-y-4">

                    {/* Device Name */}

                    <input
                        type="text"
                        placeholder="Device Name"
                        className="w-full rounded-lg border p-3"
                        value={deviceName}
                        onChange={(e) =>
                            setDeviceName(e.target.value)
                        }
                    />


                    {/* Device Code */}

                    <input
                        type="text"
                        placeholder="Device Code"
                        className="w-full rounded-lg border p-3"
                        value={deviceCode}
                        onChange={(e) =>
                            setDeviceCode(e.target.value)
                        }
                    />


                    {/* Department */}

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
                        disabled={loadingDepartments}
                    >

                        <option value="">
                            {loadingDepartments
                                ? "Loading departments..."
                                : "Select Department"}
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


                    {/* Location */}

                    <input
                        type="text"
                        placeholder="Location"
                        className="w-full rounded-lg border p-3"
                        value={location}
                        onChange={(e) =>
                            setLocation(e.target.value)
                        }
                    />


                    {/* Firmware */}

                    <input
                        type="text"
                        placeholder="Firmware Version (optional)"
                        className="w-full rounded-lg border p-3"
                        value={firmwareVersion}
                        onChange={(e) =>
                            setFirmwareVersion(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="mt-8 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-lg border px-5 py-2"
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-lg bg-purple-600 px-5 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Save"}
                    </button>

                </div>

            </div>

        </div>

    );
}