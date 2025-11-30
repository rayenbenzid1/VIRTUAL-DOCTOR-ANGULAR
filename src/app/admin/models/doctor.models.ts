export interface DoctorPendingResponse {
  id: string;
  doctorId: string;
  email: string;
  fullName: string;
  medicalLicenseNumber: string;
  specialization: string;
  hospitalAffiliation: string;
  yearsOfExperience: number;
  registrationDate: string;
  activationRequestDate: string;
}

export interface DoctorActivationRequest {
  doctorId: string;
  action: 'APPROVE' | 'REJECT';
  notes?: string;
}

export interface DoctorStatistics {
  pendingCount: number;
  activatedCount: number;
  totalCount: number;
}