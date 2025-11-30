// src/app/shared/models/profile.models.ts

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  profilePictureUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate?: string;
  gender?: Gender;
  score?: number;
  phoneNumber?: string;
  profilePictureUrl?: string;
  roles: UserRole[];
  accountStatus: AccountStatus;
  isEmailVerified?: boolean;
  isActivated?: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
  
  // Doctor-specific fields
  medicalLicenseNumber?: string;
  specialization?: string;
  hospitalAffiliation?: string;
  yearsOfExperience?: number;
  activationDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}