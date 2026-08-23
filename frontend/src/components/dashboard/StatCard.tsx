import { LucideIcon } from "lucide-react";

type StatCardProps = {
    title: string;
    value: number;
    subtitle: string;
    icon: LucideIcon;
    color: string;
    /**
     * Optional. When true, renders a skeleton in place of the value so the
     * card never shows a misleading "0" while /dashboard/summary is still
     * in flight. Defaults to false so existing call sites are unaffected.
     */
    isLoading?: boolean;
    /**
     * Optional. Tailwind background class for the 3px top accent bar,
     * e.g. "bg-blue-500". Falls back to `color` if omitted, so existing
     * call sites that don't pass it still render correctly.
     */
    accent?: string;
};

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    isLoading = false,
    accent,
}: StatCardProps) {

    return (

        <div className="group relative min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">

            {/* Top accent bar — the card's one colour statement, tying each
                stat back to the same meaning it carries everywhere else in
                the app (blue = info, green = present, red = absent, violet
                = devices/system) rather than leaving the card colourless. */}
            <div className={`h-1 w-full ${accent ?? color}`} aria-hidden="true" />

            <div className="p-5 sm:p-6">

                <div className="flex items-start justify-between gap-4">

                    {/* min-w-0 is load-bearing here: it's what lets the value/
                        subtitle truncate instead of forcing the card (and the
                        grid row) to overflow when the number or label is long. */}
                    <div className="min-w-0 flex-1">

                        <h2 className="truncate text-sm font-medium text-slate-500">
                            {title}
                        </h2>

                        {isLoading ? (
                            <div className="mt-3 h-8 w-20 animate-pulse rounded-md bg-slate-100 sm:h-9" />
                        ) : (
                            <p className="mt-2 truncate text-3xl font-bold tabular-nums text-slate-900 sm:text-4xl">
                                {value.toLocaleString("en-IN")}
                            </p>
                        )}

                        <p className="mt-1.5 truncate text-sm text-slate-400">
                            {subtitle}
                        </p>

                    </div>

                    {/* shrink-0 keeps the icon chip a fixed size no matter how
                        tight the card gets. The inner gradient overlay gives it
                        a faint glass sheen — a quiet callback to the prism's
                        material without turning the whole card into a graphic. */}
                    <div
                        className={`relative shrink-0 overflow-hidden rounded-lg p-3 shadow-sm transition-transform duration-200 group-hover:scale-105 ${color}`}
                    >
                        <div
                            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-white/0 to-black/10"
                            aria-hidden="true"
                        />
                        <Icon
                            size={22}
                            className="relative text-white"
                            aria-hidden="true"
                        />
                    </div>

                </div>

            </div>

        </div>

    );
}
