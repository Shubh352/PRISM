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

    useEffect(() => {
        setAdmin(isAdmin());
    }, []);

    useEffect(() => {
        fetchDevices();
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


    function getDeviceStatus(device: Device) {

        if (!device.is_active) {
            return "Inactive";
        }

        if (!device.last_seen) {
            return "Never connected";
        }

        return "Connected";
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
                        onClick={() => setShowModal(true)}
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

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            <DeviceModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onDeviceAdded={fetchDevices}
            />

        </>
    );
}