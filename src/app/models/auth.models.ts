// Créez ce fichier : src/app/models/auth.models.ts

export interface AuthResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: UserResponse;
  issuedAt: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate?: string;
  gender?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  roles: string[];
  accountStatus?: string;
  isEmailVerified: boolean;
  isActivated: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  // Champs spécifiques médecin
  medicalLicenseNumber?: string;
  specialization?: string;
  hospitalAffiliation?: string;
  yearsOfExperience?: number;
  activationDate?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  birthDate?: string;
  gender?: string;
  role: string;
  // Champs médecin
  medicalLicenseNumber?: string;
  specialization?: string;
  hospitalAffiliation?: string;
  yearsOfExperience?: number;
}