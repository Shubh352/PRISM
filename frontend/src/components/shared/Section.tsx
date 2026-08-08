type SectionProps = {
    children: React.ReactNode;
    className?: string;
};

export default function Section({
    children,
    className = "",
}: SectionProps) {

    return (

        <div
            className={`rounded-2xl bg-white p-6 shadow ${className}`}
        >

            {children}

        </div>

    );

}