export interface User {
  id: string;
  name?: string;
  email: string;
  password?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  provider?: string;
  providerAccountId?: string;
} 