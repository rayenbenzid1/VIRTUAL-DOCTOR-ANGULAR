export interface UserManagementResponse {
  id: string;
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles: string[];
  accountStatus: string;
  isActivated: boolean;
  isEmailVerified?: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserSearchRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  page: number;
  size: number;
}

export interface UserStatistics {
  totalUsers: number;
  totalDoctors: number;
  totalAdmins: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}