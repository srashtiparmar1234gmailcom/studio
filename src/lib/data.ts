import type { User, MembershipPlan, UserMembership, Attendance } from './types';

export const users: User[] = [
  { id: 'usr_1', name: 'Tony Hawk', email: 'tony@skate.com', phone: '123-456-7890', role: 'customer', avatarUrl: 'https://picsum.photos/seed/1/40/40' },
  { id: 'usr_2', name: 'Leticia Bufoni', email: 'leticia@skate.com', phone: '234-567-8901', role: 'customer', avatarUrl: 'https://picsum.photos/seed/2/40/40' },
  { id: 'usr_3', name: 'Harsh Rajput', email: 'srashtiparmar1234@gmail.com', phone: '1234567890', role: 'admin', avatarUrl: 'https://picsum.photos/seed/admin/40/40' },
  { id: 'usr_4', name: 'Bob Burnquist', email: 'bob@skate.com', phone: '345-678-9012', role: 'customer', avatarUrl: 'https://picsum.photos/seed/4/40/40' },
  { id: 'usr_5', name: 'Elissa Steamer', email: 'elissa@skate.com', phone: '456-789-0123', role: 'customer', avatarUrl: 'https://picsum.photos/seed/5/40/40' },
  { id: 'usr_6', name: 'Nyjah Huston', email: 'nyjah@skate.com', phone: '567-890-1234', role: 'customer', avatarUrl: 'https://picsum.photos/seed/6/40/40' },
  { id: 'usr_7', name: 'Rodney Mullen', email: 'rodney@skate.com', phone: '678-901-2345', role: 'customer', avatarUrl: 'https://picsum.photos/seed/7/40/40' },
];

export const membershipPlans: MembershipPlan[] = [
  { id: 'plan_1', name: 'Hourly', price: 60, validityDays: 1, type: 'Hourly' },
  { id: 'plan_2', name: 'Weekly', price: 200, validityDays: 7, type: 'Weekly' },
  { id: 'plan_3', name: 'Monthly', price: 350, validityDays: 30, type: 'Monthly' },
];

export const userMemberships: UserMembership[] = [
  { id: 'mem_1', userId: 'usr_1', planId: 'plan_2', startDate: new Date('2024-07-01'), totalDays: 7, daysUsed: 2 },
  { id: 'mem_2', userId: 'usr_2', planId: 'plan_3', startDate: new Date('2024-06-15'), totalDays: 30, daysUsed: 15 },
  { id: 'mem_4', userId: 'usr_4', planId: 'plan_3', startDate: new Date('2024-07-10'), totalDays: 30, daysUsed: 5 },
  { id: 'mem_5', userId: 'usr_5', planId: 'plan_2', startDate: new Date('2024-07-20'), totalDays: 7, daysUsed: 6 },
  { id: 'mem_6', userId: 'usr_6', planId: 'plan_3', startDate: new Date('2024-07-01'), totalDays: 30, daysUsed: 29 },
  { id: 'mem_7', userId: 'usr_7', planId: 'plan_1', startDate: new Date('2024-07-22'), totalDays: 1, daysUsed: 1 },
];

export const attendance: Attendance[] = [
  { id: 'att_1', userId: 'usr_1', date: new Date('2024-07-10') },
  { id: 'att_2', userId: 'usr_1', date: new Date('2024-07-12') },
  ...Array.from({ length: 15 }, (_, i) => ({ id: `att_${3 + i}`, userId: 'usr_2', date: new Date(2024, 6, i + 1) })),
  ...Array.from({ length: 5 }, (_, i) => ({ id: `att_${18 + i}`, userId: 'usr_4', date: new Date(2024, 6, i + 10) })),
  ...Array.from({ length: 6 }, (_, i) => ({ id: `att_${23 + i}`, userId: 'usr_5', date: new Date(2024, 6, i + 20) })),
  ...Array.from({ length: 29 }, (_, i) => ({ id: `att_${29 + i}`, userId: 'usr_6', date: new Date(2024, 6, i + 1) })),
  { id: 'att_58', userId: 'usr_7', date: new Date('2024-07-22') },
  { id: 'att_today_1', userId: 'usr_1', date: new Date() },
  { id: 'att_today_2', userId: 'usr_4', date: new Date() },
];

export const getMockUser = (role: 'admin' | 'customer' = 'customer'): User => {
  if (role === 'admin') {
    return users.find(u => u.role === 'admin')!;
  }
  const loggedInUserEmail = typeof window !== 'undefined' ? localStorage.getItem('loggedInUser') : null;
  if(loggedInUserEmail && users.find(u => u.email === loggedInUserEmail && u.role === 'customer')) {
    return users.find(u => u.email === loggedInUserEmail)!;
  }
  return users.find(u => u.role === 'customer')!;
};