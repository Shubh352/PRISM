type Department = {
    id: number;
    department_name: string;
};

type AttendanceFiltersProps = {
    search: string;
    setSearch: (value: string) => void;

    dateFilter: string;
    setDateFilter: (value: string) => void;

    semesterFilter: string;
    setSemesterFilter: (value: string) => void;

    departmentFilter: string;
    setDepartmentFilter: (value: string) => void;

    statusFilter: string;
    setStatusFilter: (value: string) => void;

    departments: Department[];

    onReset: () => void;
};

export default function AttendanceFilters({

    search,
    setSearch,

    dateFilter,
    setDateFilter,

    semesterFilter,
    setSemesterFilter,

    departmentFilter,
    setDepartmentFilter,

    statusFilter,
    setStatusFilter,

    departments,

    onReset,

}: AttendanceFiltersProps) {

    return (

        <div className="mt-8 rounded-2xl bg-white p-6 shadow">

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">

                <input
                    type="text"
                    placeholder="Search Student..."
                    className="rounded-lg border p-3"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <input
                    type="date"
                    className="rounded-lg border p-3"
                    value={dateFilter}
                    onChange={(e) =>
                        setDateFilter(e.target.value)
                    }
                />

                <select
                    className="rounded-lg border p-3"
                    value={semesterFilter}
                    onChange={(e) =>
                        setSemesterFilter(e.target.value)
                    }
                >

                    <option value="">
                        All Semesters
                    </option>

                    {[1,2,3,4,5,6,7,8].map((semester) => (

                        <option
                            key={semester}
                            value={semester}
                        >
                            {semester}
                        </option>

                    ))}

                </select>

                <select
                    className="rounded-lg border p-3"
                    value={departmentFilter}
                    onChange={(e) =>
                        setDepartmentFilter(e.target.value)
                    }
                >

                    <option value="">
                        All Departments
                    </option>

                    {departments.map((department) => (

                        <option
                            key={department.id}
                            value={department.department_name}
                        >
                            {department.department_name}
                        </option>

                    ))}

                </select>

                <select
                    className="rounded-lg border p-3"
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >

                    <option value="">
                        All Status
                    </option>

                    <option value="Present">
                        Present
                    </option>

                    <option value="Partial">
                        Partial
                    </option>

                    <option value="Absent">
                        Absent
                    </option>

                </select>

                <button
                    onClick={onReset}
                    className="rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                    Reset Filters
                </button>

            </div>

        </div>

    );

}