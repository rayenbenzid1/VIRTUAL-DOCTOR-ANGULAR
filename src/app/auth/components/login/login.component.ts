// Handle different response structures for doctor vs patient login
const userData = res.user || res;

// Construct user object
const user = {
  id: res.doctorId || res.userId || res.id || userData.id,
  name: userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
  firstName: userData.firstName,
  lastName: userData.lastName,
  email: userData.email,
  phoneNumber: userData.phoneNumber,
  role: res.role || userData.role
};

console.log('Constructed user object:', user);
localStorage.setItem('user', JSON.stringify(user));
