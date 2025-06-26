
export interface User {
    id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin'| 'superadmin'|'mechanic';
  phone?: string;
  address?: string;
  createdAt: string;
    updatedAt: string;
}

export interface createUserInput {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin' | 'superadmin' | 'mechanic';
    phone?: string;
    address?: string;
}