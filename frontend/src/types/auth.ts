export type UserRole = 'ADMIN' | 'BASE_COMMANDER' | 'LOGISTICS_OFFICER';

export type AuthUser = {
  id: string;
  username: string;
  role: UserRole;
  baseId: string | null;
};

export type LoginResponse = {
  success: true;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
};
