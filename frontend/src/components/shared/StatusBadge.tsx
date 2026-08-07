type Props = {
    status: string;
};

export default function StatusBadge({
    status,
}: Props) {

    if (status === "Present") {

        return (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                Present
            </span>
        );

    }

    if (status === "Done") {

        return (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                Done
            </span>
        );

    }

    if (status === "Absent") {

        return (
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                Absent
            </span>
        );

    }

    if (status === "Partial") {

        return (
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                Partial
            </span>
        );

    }

    return (

        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">

            —

        </span>

    );

}