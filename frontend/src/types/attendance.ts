export type AttendanceRecord = {

    id: number;

    name: string;

    roll_number: string;

    department: string;

    semester: number;

    attendance_date: string;

    entry_1_time: string | null;

    entry_2_time: string | null;

    punch_out_time: string | null;

    morning_status: string;

    afternoon_status: string;

    punch_out_status: string;

    status: string;

};