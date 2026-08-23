export type AttendanceRecord = {
    id: number;

    name: string;

    roll_number: string;

    department: string;

    semester: number;

    attendance_date: string;

    punch_in_time: string | null;

    status: string;
};