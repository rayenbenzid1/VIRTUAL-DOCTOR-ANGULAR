================================================================================
                    DOCTOR DASHBOARD - DEVELOPER GUIDE
================================================================================

This guide will help you understand and modify the Doctor Dashboard components
in the Virtual Doctor Angular application.

================================================================================
                        TABLE OF CONTENTS
================================================================================

1. Overview
2. Project Structure
3. Key Components
4. API Integration
5. How to Modify Common Features
6. Important Notes
7. Troubleshooting

================================================================================
                        1. OVERVIEW
================================================================================

The Doctor Dashboard is the main interface for doctors to:
- View their statistics (total patients, appointments, etc.)
- Manage appointments (accept, reject, cancel, complete)
- View patient information
- Track their daily activities

The dashboard uses Angular Signals for reactive state management and connects
to a Spring Boot backend API.

================================================================================
                        2. PROJECT STRUCTURE
================================================================================

Doctor-related files are located in:
src/app/doctor/

Key directories:
├── components/
│   ├── doctor-dashboard/          # Main dashboard component
│   ├── dashboard-stats/            # Statistics cards
│   ├── dashboard-appointments/     # Appointments list
│   ├── dashboard-patients/         # Patients list
│   └── patient-details-modal/      # Patient info modal
└── services/
    └── appointment.api.ts          # API service for backend calls

================================================================================
                        3. KEY COMPONENTS
================================================================================

A. DOCTOR DASHBOARD COMPONENT
   Location: src/app/doctor/components/doctor-dashboard/
   
   Files:
   - doctor-dashboard.component.ts    (Logic)
   - doctor-dashboard.component.html  (Template)
   - doctor-dashboard.component.css   (Styles)
   
   What it does:
   - Loads dashboard data from API
   - Manages appointments and patients
   - Handles user interactions
   - Auto-refreshes data every 30 seconds

B. PATIENT DETAILS MODAL
   Location: src/app/doctor/components/patient-details-modal/
   
   Displays:
   - Patient name and email
   - Patient statistics (total/completed/cancelled appointments)
   - Visit history (first visit, last visit, next appointment)
   - Appointment context (if opened from an appointment)
   - Medical history, allergies, medications (if available)

C. APPOINTMENT API SERVICE
   Location: src/app/doctor/services/appointment.api.ts
   
   API Endpoints:
   - getDashboardStats()        → GET /api/doctors/stats
   - getDoctorAppointments()    → GET /api/doctors/appointments
   - getMyPatients()            → GET /api/doctors/appointments/patients
   - acceptAppointment(id)      → PUT /api/doctors/appointments/{id}/accept
   - rejectAppointment(id)      → PUT /api/doctors/appointments/{id}/reject
   - cancelAppointment(id)      → PUT /api/doctors/appointments/{id}/cancel
   - completeAppointment(id)    → PUT /api/doctors/appointments/{id}/complete

================================================================================
                    4. API INTEGRATION
================================================================================

The dashboard expects the following API responses:

A. DASHBOARD STATS
   Endpoint: GET /api/doctors/stats
   Response:
   {
     "totalPatients": 150,
     "todayAppointments": 8,
     "pendingAppointments": 3,
     "todayCompleted": 5
   }

B. APPOINTMENTS
   Endpoint: GET /api/doctors/appointments
   Response: Array of appointments
   [
     {
       "id": "123",
       "patientId": "456",
       "patientName": "John Doe",
       "patientEmail": "john@example.com",
       "patientPhone": "+1234567890",
       "appointmentDateTime": "2025-11-29T10:00:00",
       "appointmentType": "CONSULTATION",
       "status": "PENDING",
       "reason": "Checkup",
       "notes": "Patient notes here"
     }
   ]

C. PATIENTS
   Endpoint: GET /api/doctors/appointments/patients
   Response: Array of patients
   [
     {
       "patientId": "691373000359375f0db8fe5e",
       "patientName": "John Patient",
       "patientEmail": "john.patient@gmail.com",
       "patientPhone": "+1234567890",
       "totalAppointments": 7,
       "completedAppointments": 1,
       "cancelledAppointments": 3,
       "lastAppointmentDate": "2025-11-15T10:00:00",
       "nextAppointmentDate": null,
       "firstVisitDate": "2025-11-27T17:47:16.516"
     }
   ]

IMPORTANT: The dashboard ONLY displays data returned by the API.
Do NOT add mock data or hardcoded values.

================================================================================
                5. HOW TO MODIFY COMMON FEATURES
================================================================================

A. CHANGE WHAT PATIENT INFO IS DISPLAYED
   
   File: src/app/doctor/components/patient-details-modal/patient-details-modal.component.html
   
   The modal displays:
   - Patient Statistics (lines 95-120)
   - Visit History (lines 122-147)
   - Current Condition (lines 149-154) - only if available
   - Medical History (lines 156-165) - only if available
   - Allergies (lines 167-176) - only if available
   - Current Medications (lines 178-187) - only if available
   
   To add a new field:
   1. Make sure your API returns the field
   2. Add it to the Patient interface in doctor-dashboard.component.ts
   3. Add the HTML to display it in patient-details-modal.component.html

B. CHANGE APPOINTMENT STATUSES
   
   File: src/app/doctor/components/doctor-dashboard/doctor-dashboard.component.ts
   
   Methods:
   - acceptAppointment(appointmentId)   → Accept a pending appointment
   - rejectAppointment(appointmentId)   → Reject a pending appointment
   - cancelAppointment(appointmentId)   → Cancel an appointment
   - completeAppointment(appointmentId) → Mark appointment as completed
   
   Each method:
   1. Calls the API
   2. Updates the local appointment list
   3. Updates the statistics
   4. Shows a success/error message

C. CHANGE AUTO-REFRESH INTERVAL
   
   File: src/app/doctor/components/doctor-dashboard/doctor-dashboard.component.ts
   Line: ~130
   
   Current: 30000 (30 seconds)
   
   this.pollingInterval = setInterval(() => {
       this.refreshData();
   }, 30000); // Change this number (in milliseconds)

D. MODIFY STATISTICS CARDS
   
   File: src/app/doctor/components/dashboard-stats/dashboard-stats.component.ts
   
   The stats component receives data from the parent dashboard.
   To add a new stat:
   1. Update the DashboardStats interface
   2. Update the API response mapping
   3. Add the new stat card in the HTML template

E. CHANGE API BASE URL
   
   File: src/environments/environment.ts
   
   export const environment = {
       production: false,
       BASE_URL: 'http://localhost:8080'  // Change this
   };

F. MODIFY DOCTOR PROFILE UPDATE
   
   The profile update feature allows doctors to update their information.
   
   Files:
   - doctor-dashboard.component.ts (lines 419-441)
   - doctor-dashboard.component.html (lines 100-144)
   
   Current Implementation:
   - Only allows updating the doctor's name
   - Stores data in localStorage (not sent to backend)
   - Shows a simple modal with name, email, and specialization fields
   
   How to Add More Editable Fields:
   
   1. UPDATE THE HTML FORM (doctor-dashboard.component.html):
      
      Add new input fields in the form (after line 124):
      
      <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" class="form-control" id="phoneInput" 
                 [value]="currentUser()?.phone || ''" required>
      </div>
      
      <div class="form-group">
          <label>Specialization</label>
          <input type="text" class="form-control" id="specializationInput"
                 [value]="currentUser()?.specialization || ''" required>
      </div>
   
   2. UPDATE THE LOGIC (doctor-dashboard.component.ts):
      
      Modify the updateProfile method (line 427):
      
      updateProfile(event: Event) {
          event.preventDefault();
          const form = event.target as HTMLFormElement;
          
          // Get all input values
          const nameInput = form.querySelector('#nameInput') as HTMLInputElement;
          const phoneInput = form.querySelector('#phoneInput') as HTMLInputElement;
          const specializationInput = form.querySelector('#specializationInput') as HTMLInputElement;
          
          const updatedData = {
              name: nameInput.value,
              phone: phoneInput.value,
              specialization: specializationInput.value
          };
          
          // Option 1: Save to localStorage only (current implementation)
          const user = this.currentUser() || {};
          const updatedUser = { ...user, ...updatedData };
          this.currentUser.set(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          alert('Profile updated successfully!');
          this.closeProfileSettings();
          
          // Option 2: Send to backend API (recommended)
          // this.doctorAuthApi.updateProfile(updatedData).subscribe({
          //     next: (response) => {
          //         this.currentUser.set(response);
          //         localStorage.setItem('user', JSON.stringify(response));
          //         alert('Profile updated successfully!');
          //         this.closeProfileSettings();
          //     },
          //     error: (error) => {
          //         console.error('Error updating profile:', error);
          //         alert('Failed to update profile. Please try again.');
          //     }
          // });
      }
   
   3. CREATE BACKEND API ENDPOINT (if using Option 2):
      
      Add to doctor-auth.api.ts:
      
      updateProfile(profileData: any): Observable<any> {
          return this.http.put(`${this.BASE_URL}/doctor/profile`, profileData);
      }
      
      Backend should handle: PUT /doctor/profile
      Request body: { name, phone, specialization, etc. }
      Response: Updated doctor object
   
   4. ADD VALIDATION:
      
      Add validation to the form inputs:
      
      <input type="tel" class="form-control" 
             pattern="[0-9]{10}" 
             title="Please enter a valid 10-digit phone number"
             required>
      
      Add validation in TypeScript:
      
      if (!nameInput.value.trim()) {
          alert('Name is required');
          return;
      }
      
      if (phoneInput.value && !/^[0-9]{10}$/.test(phoneInput.value)) {
          alert('Please enter a valid phone number');
          return;
      }
   
   5. DISPLAY UPDATED VALUES:
      
      The profile modal currently shows hardcoded values for email and 
      specialization. To show real data:
      
      Change line 128 from:
      <input type="email" class="form-control" value="doctor@example.com" disabled>
      
      To:
      <input type="email" class="form-control" 
             [value]="currentUser()?.email || 'Not set'" disabled>
      
      Change line 133 from:
      <input type="text" class="form-control" value="General Medicine" disabled>
      
      To:
      <input type="text" class="form-control" 
             [value]="currentUser()?.specialization || 'Not set'" disabled>
   
   Important Notes:
   - Currently, profile updates are ONLY saved to localStorage
   - Data is NOT sent to the backend
   - If you want persistent updates, implement Option 2 above
   - Make sure to add proper validation for all fields
   - Consider adding a loading state while updating

================================================================================
                        6. IMPORTANT NOTES
================================================================================

1. DATA INTEGRITY
   - The dashboard displays ONLY what the API returns
   - Do NOT add mock data or default values for missing fields
   - Use conditional rendering (@if) to hide missing data

2. AUTHENTICATION
   - The app uses JWT tokens stored in localStorage
   - Tokens are automatically added to API requests via auth.interceptor.ts
   - If you get 401 errors, check that the user is logged in

3. PATIENT INTERFACE
   Location: src/app/doctor/components/doctor-dashboard/doctor-dashboard.component.ts
   
   interface Patient {
       id: string;
       name: string;
       email: string;
       age?: number;                    // Optional - may not be in API
       phone?: string;                  // Optional
       gender?: string;                 // Optional - may not be in API
       address?: string;                // Optional - may not be in API
       lastVisit?: string;
       condition?: string;
       medicalHistory?: string[];
       allergies?: string[];
       currentMedications?: string[];
       totalAppointments?: number;
       completedAppointments?: number;
       cancelledAppointments?: number;
       nextAppointmentDate?: string;
       firstVisitDate?: string;
   }
   
   Fields marked with ? are optional and may not be returned by the API.

4. APPOINTMENT INTERFACE
   Location: src/app/doctor/components/dashboard-appointments/dashboard-appointments.component.ts
   
   Contains all appointment-related fields including:
   - Basic info (id, patientId, patientName, etc.)
   - Scheduling (date, time, appointmentDateTime)
   - Status and type
   - Cancellation details (cancelledBy, cancellationReason)
   - Completion details (diagnosis, prescription, doctorNotes)

================================================================================
                        7. TROUBLESHOOTING
================================================================================

PROBLEM: Dashboard shows no data
SOLUTION:
1. Check browser console for API errors
2. Verify backend is running on http://localhost:8080
3. Check that you're logged in (check localStorage for 'accessToken')
4. Verify API endpoints are correct

PROBLEM: Patient modal shows "Not specified" for all fields
SOLUTION:
1. Check the API response in browser Network tab
2. Verify the field names match between API and interface
3. Make sure the patient data is being loaded correctly

PROBLEM: Appointments not updating after action
SOLUTION:
1. Check browser console for errors
2. Verify the API endpoint is returning the updated appointment
3. Check that updateAppointmentStatus() is being called

PROBLEM: 401 Unauthorized errors
SOLUTION:
1. Check that accessToken exists in localStorage
2. Verify the token is valid (not expired)
3. Check auth.interceptor.ts is adding the token to requests
4. Try logging out and logging back in

PROBLEM: Data not auto-refreshing
SOLUTION:
1. Check that pollingInterval is set in the constructor
2. Verify ngOnDestroy() is clearing the interval
3. Check browser console for errors during refresh

================================================================================
                        CONTACT & SUPPORT
================================================================================

For questions or issues:
1. Check the browser console for error messages
2. Review the API response in the Network tab
3. Verify your changes match the API contract
4. Test with the backend running locally

Remember: The dashboard is designed to work with the Spring Boot backend API.
Any changes to the frontend should match the API response structure.

================================================================================
                        END OF GUIDE
================================================================================
