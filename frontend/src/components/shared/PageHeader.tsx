type PageHeaderProps = {

    title: string;

    subtitle?: string;

    rightElement?: React.ReactNode;

};

export default function PageHeader({

    title,

    subtitle,

    rightElement,

}: PageHeaderProps) {

    return (

        <div className="mb-8 flex items-center justify-between">

            <div>

                <h1 className="text-4xl font-bold text-white">

                    {title}

                </h1>

                {subtitle && (

                    <p className="mt-2 text-slate-400">

                        {subtitle}

                    </p>

                )}

            </div>

            {rightElement && (

                <div>

                    {rightElement}

                </div>

            )}

        </div>

    );

}