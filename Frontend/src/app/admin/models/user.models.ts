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
  // ✅ Ajout pour les médecins
  activationStatus?: string; // PENDING, APPROVED, REJECTED
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

export interface DoctorResponse {
  id: string;
  doctorId: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
  roles?: string[];
  accountStatus?: string;
  isActivated?: boolean;
  isEmailVerified?: boolean;
  createdAt?: string;
  lastLoginAt?: string | null;
  medicalLicenseNumber: string;
  specialization: string;
  hospitalAffiliation: string;
  yearsOfExperience: number;
  registrationDate: string;
  activationRequestDate: string;
  // ✅ Ajout du statut d'activation
  activationStatus?: string; // PENDING, APPROVED, REJECTED
}