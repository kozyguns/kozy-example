export interface Employee {
  employee_id: number;
  name: string;
  first_name?: string; // Add this line
  last_name: string;
  work_email?: string; // Add this line
  phone_number: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  department: string;
  role: string;
  position?: string; // Add this line
  contact_info: string;
  pay_type: string | null;
  rank: number | null;
  pay_rate: number | null;
  hire_date: string | null;
  birthday: string | null;
  promotion_date: string | null;
}

export interface ReferenceSchedule {
  employee_id: number;
  day_of_week: string;
  start_time: string | null;
  end_time: string | null;
  name: string;
}