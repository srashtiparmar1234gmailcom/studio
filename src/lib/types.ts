export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  avatarUrl: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  validityDays: number;
  type: 'Hourly' | 'Weekly' | 'Monthly';
}

export interface UserMembership {
  id: string;
  userId: string;
  planId: string;
  startDate: Date;
  totalDays: number;
  daysUsed: number;
}

export interface Attendance {
  id: string;
  userId: string;
  date: Date;
}
