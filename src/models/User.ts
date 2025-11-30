export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  address: string;
  role: 'admin' | 'user';
}  