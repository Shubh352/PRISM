"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import DeviceModal from "@/components/devices/DeviceModal";
import { isAdmin } from "@/lib/auth";

type Device = {
    id: number;
    device_name: string;
    device_code: string;
    department_id: number;
    location: string;
    firmware_version: string | null;
    is_active: boolean;
    last_seen: string | null;
};

export default function DevicesPage() {

    const [devices, setDevices] = useState<Device[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [selectedDevice, setSelectedDevice] =
        useState<Device | null>(null);

    useEffect(() => {
        setAdmin(isAdmin());
    }, []);

    useEffect(() => {
        fetchDevices();

        const interval = setInterval(() => {
            fetchDevices();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    async function fetchDevices() {

        setLoading(true);

        try {

            const response = await api.get("/devices");

            setDevices(response.data);

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to fetch devices."
            );

        } finally {

            setLoading(false);

        }
    }

    async function handleDelete(device: Device) {

        const confirmed = window.confirm(
            `Delete ${device.device_name}?`
        );

        if (!confirmed) return;

        try {

            await api.delete(
                `/devices/${device.id}`
            );

            toast.success(
                "Device deleted successfully!"
            );

            fetchDevices();

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to delete device."
            );
        }
    }


    function getDeviceStatus(device: Device) {
        if (!device.is_active) {
            return (
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Inactive
                </span>
            );
        }

        if (!device.last_seen) {
            return (
                <span className="inline-flex rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                    Never Connected
                </span>
            );
        }

        const lastSeen = new Date(
            device.last_seen.endsWith("Z")
                ? device.last_seen
                : device.last_seen + "Z"
        ).getTime();

        const now = Date.now();

        const isOnline =
            now - lastSeen <= 60 * 1000;

        if (isOnline) {
            return (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Online
                </span>
            );
        }

        return (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Offline
            </span>
        );
    }

    return (
        <>
            {/* Header */}

            <div className="mb-8 flex items-center justify-between">

                <div>

                    <h1 className="text-4xl font-bold">
                        Devices
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Monitor registered PRISM devices
                    </p>

                </div>

                {admin && (
                    <button
                        onClick={() => {
                            setSelectedDevice(null);
                            setShowModal(true);
                        }}
                        className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
                    >
                        + Add Device
                    </button>
                )}

            </div>


            {/* Loading */}

            {loading ? (

                <div className="rounded-lg bg-white p-8 text-center shadow">

                    Loading devices...

                </div>

            ) : devices.length === 0 ? (

                <div className="rounded-xl bg-white p-12 text-center shadow">

                    <div className="text-5xl">
                        📡
                    </div>

                    <h2 className="mt-4 text-xl font-semibold">
                        No devices registered
                    </h2>

                    <p className="mt-2 text-gray-500">
                        PRISM devices will appear here once registered.
                    </p>

                </div>

            ) : (

                <div className="overflow-x-auto rounded-xl bg-white shadow">

                    <table className="min-w-full">

                        <thead className="bg-purple-600 text-white">

                            <tr>

                                <th className="px-4 py-3 text-left">
                                    Device
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Code
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Location
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Firmware
                                </th>

                                <th className="px-4 py-3 text-left">
                                    Status
                                </th>

                                {admin && (
                                    <th className="px-4 py-3 text-left">
                                        Actions
                                    </th>
                                )}

                            </tr>

                        </thead>

                        <tbody>

                            {devices.map((device) => (

                                <tr
                                    key={device.id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="px-4 py-3 font-medium">
                                        {device.device_name}
                                    </td>

                                    <td className="px-4 py-3">
                                        {device.device_code}
                                    </td>

                                    <td className="px-4 py-3">
                                        {device.location}
                                    </td>

                                    <td className="px-4 py-3">
                                        {device.firmware_version ?? "—"}
                                    </td>

                                    <td className="px-4 py-3">
                                        {getDeviceStatus(device)}
                                    </td>

                                    {admin && (
                                        <td className="px-4 py-3">

                                            <button
                                                onClick={() => {
                                                    setSelectedDevice(device);
                                                    setShowModal(true);
                                                }}
                                                className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(device)}
                                                className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>

                                        </td>
                                    )}

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            <DeviceModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedDevice(null);
                }}
                onDeviceSaved={fetchDevices}
                device={selectedDevice}
            />

        </>
    );
}
