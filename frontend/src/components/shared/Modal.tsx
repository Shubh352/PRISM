type ModalProps = {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
};

export default function Modal({
    isOpen,
    title,
    onClose,
    children,
}: ModalProps) {

    if (!isOpen) return null;

    return (

        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >

            <div
                className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="mb-6 flex items-center justify-between">

                    <h2 className="text-2xl font-bold">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-2xl text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>

                </div>

                {children}

            </div>

        </div>

    );

}