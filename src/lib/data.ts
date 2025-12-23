import type { User, MembershipPlan, UserMembership, Attendance } from './types';

export const users: User[] = [
  { id: 'usr_3', name: 'Harsh Rajput', email: 'srashtiparmar1234@gmail.com', phone: '1234567890', role: 'admin', avatarUrl: 'https://picsum.photos/seed/admin/40/40', password: 'harshgaurav', createdAt: new Date() },
];

export const membershipPlans: MembershipPlan[] = [
  { id: 'plan_1', name: 'Hourly', price: 60, validityDays: 1, type: 'Hourly' },
  { id: 'plan_2', name: 'Weekly', price: 200, validityDays: 7, type: 'Weekly' },
  { id: 'plan_3', name: 'Monthly', price: 350, validityDays: 30, type: 'Monthly' },
];

export let userMemberships: UserMembership[] = [];

export let attendance: Attendance[] = [];

// Helper to get all users, including those from localStorage
export const getAllUsers = (): User[] => {
  if (typeof window === 'undefined') {
    return users; // Return initial admin during SSR
  }
  const storedUsers = localStorage.getItem('users');
  if (storedUsers) {
    try {
      const parsedUsers = JSON.parse(storedUsers).map((u: any) => ({ ...u, createdAt: new Date(u.createdAt) }));
      // Ensure it's an array, if not, reset it.
      if (Array.isArray(parsedUsers)) {
        // Check if admin user exists, if not, add it.
        if (!parsedUsers.some(u => u.role === 'admin')) {
          const resetUsers = [...users, ...parsedUsers.filter(u => u.role !== 'admin')];
          localStorage.setItem('users', JSON.stringify(resetUsers));
          return resetUsers;
        }
        return parsedUsers;
      }
    } catch (e) {
        // If parsing fails, reset to default
    }
  }
  localStorage.setItem('users', JSON.stringify(users));
  return users;
};


export const getMockUser = (role: 'admin' | 'customer' = 'customer'): User => {
  const allUsers = getAllUsers();
  if (role === 'admin') {
    const adminUser = allUsers.find(u => u.role === 'admin');
    if (adminUser) return adminUser;
  }
  
  const loggedInUserEmail = typeof window !== 'undefined' ? localStorage.getItem('loggedInUser') : null;

  if (loggedInUserEmail) {
      const loggedInUser = allUsers.find(u => u.email === loggedInUserEmail);
      if (loggedInUser) return loggedInUser;
  }
  
  // Fallback for customer if not found or if role is customer but no specific user is logged in
  const customerUser = allUsers.find(u => u.role === 'customer');
  if (role === 'customer' && customerUser) return customerUser;

  // Final fallback to a guest user if no other user is found
  return { id: 'usr_mock', name: 'Guest User', email: '', phone: '', role: 'customer', avatarUrl: 'https://picsum.photos/seed/guest/40/40', password: '', createdAt: new Date() };
};

// Function to add attendance and save to localStorage
export const addAttendance = (userId: string): Attendance => {
  const newAttendance: Attendance = {
    id: `att_${new Date().getTime()}`,
    userId,
    date: new Date(),
  };

  if (typeof window !== 'undefined') {
    const storedAttendance = localStorage.getItem('attendance');
    let currentAttendance: Attendance[] = [];
    if (storedAttendance) {
      try {
        currentAttendance = JSON.parse(storedAttendance).map((a: any) => ({...a, date: new Date(a.date)}));
      } catch (e) {
        currentAttendance = [];
      }
    }
    const updatedAttendance = [...currentAttendance, newAttendance];
    localStorage.setItem('attendance', JSON.stringify(updatedAttendance));
    attendance = updatedAttendance;
  } else {
    attendance.push(newAttendance);
  }

  return newAttendance;
};


// Helper to get all memberships, including those from localStorage
export const getAllMemberships = (): UserMembership[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const storedMemberships = localStorage.getItem('userMemberships');
  if (storedMemberships) {
    try {
      const parsedMemberships = JSON.parse(storedMemberships).map((m: any) => ({
        ...m,
        startDate: new Date(m.startDate),
      }));
      if (Array.isArray(parsedMemberships)) {
        return parsedMemberships;
      }
    } catch (e) {
      // If parsing fails, return empty array
    }
  }
  return [];
};


// Function to assign/update a membership and save to localStorage
export const assignMembership = (userId: string, planId: string): UserMembership => {
  const plan = membershipPlans.find(p => p.id === planId);
  if (!plan) {
    throw new Error('Plan not found');
  }

  const newMembership: UserMembership = {
    id: `mem_${new Date().getTime()}`,
    userId,
    planId,
    startDate: new Date(),
    totalDays: plan.validityDays,
    daysUsed: 0,
  };

  if (typeof window !== 'undefined') {
    let currentMemberships = getAllMemberships();
    
    // Remove existing membership for the user, if any
    currentMemberships = currentMemberships.filter(m => m.userId !== userId);
    
    const updatedMemberships = [...currentMemberships, newMembership];
    localStorage.setItem('userMemberships', JSON.stringify(updatedMemberships));
    userMemberships = updatedMemberships;
  } else {
    userMemberships.push(newMembership);
  }

  return newMembership;
};
