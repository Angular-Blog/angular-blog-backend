export interface RegistrationStatus {
  success: boolean;
  message: string;
}

export interface RegistrationCredentials {
  email: string;
  username: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
