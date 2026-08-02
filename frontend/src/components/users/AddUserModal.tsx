type AddUserModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function AddUserModal({
    isOpen,
    onClose,
}: AddUserModalProps) {

    if (!isOpen) return null;

    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black/50">

            <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-xl">

                <h2 className="mb-6 text-2xl font-bold">
                    Add New User
                </h2>

                <div className="space-y-4">

                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full rounded-lg border p-3"
                    />

                    <input
                        type="text"
                        placeholder="Roll Number"
                        className="w-full rounded-lg border p-3"
                    />

                    <input
                        type="text"
                        placeholder="Department"
                        className="w-full rounded-lg border p-3"
                    />

                    <input
                        type="number"
                        placeholder="Semester"
                        className="w-full rounded-lg border p-3"
                    />

                    <input
                        type="number"
                        placeholder="Fingerprint ID"
                        className="w-full rounded-lg border p-3"
                    />

                    <select
                        className="w-full rounded-lg border p-3"
                    >
                        <option>Student</option>
                        <option>Faculty</option>
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
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                        Save
                    </button>

                </div>

            </div>

        </div>

    );
}