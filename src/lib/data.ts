import type { User, MembershipPlan, UserMembership, Attendance } from './types';

export const users: User[] = [
  { id: 'usr_3', name: 'Harsh Rajput', email: 'srashtiparmar1234@gmail.com', phone: '1234567890', role: 'admin', avatarUrl: 'https://picsum.photos/seed/admin/40/40', password: 'harshgaurav' },
];

export const membershipPlans: MembershipPlan[] = [
  { id: 'plan_1', name: 'Hourly', price: 60, validityDays: 1, type: 'Hourly' },
  { id: 'plan_2', name: 'Weekly', price: 200, validityDays: 7, type: 'Weekly' },
  { id: 'plan_3', name: 'Monthly', price: 350, validityDays: 30, type: 'Monthly' },
];

export const userMemberships: UserMembership[] = [
];

export const attendance: Attendance[] = [
];

// Helper to get all users, including those from localStorage
export const getAllUsers = (): User[] => {
  if (typeof window === 'undefined') {
    return users; // Return initial admin during SSR
  }
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  localStorage.setItem('users', JSON.stringify(users));
  return users;
};


export const getMockUser = (role: 'admin' | 'customer' = 'customer'): User => {
  const allUsers = getAllUsers();
  if (role === 'admin') {
    return allUsers.find(u => u.role === 'admin')!;
  }
  const loggedInUserEmail = typeof window !== 'undefined' ? localStorage.getItem('loggedInUser') : null;

  if (loggedInUserEmail) {
      const loggedInUser = allUsers.find(u => u.email === loggedInUserEmail);
      if (loggedInUser) return loggedInUser;
  }
  
  // Fallback for customer if not found
  return allUsers.find(u => u.role === 'customer') ?? { id: 'usr_mock', name: 'Guest User', email: '', phone: '', role: 'customer', avatarUrl: 'https://picsum.photos/seed/guest/40/40' };
};