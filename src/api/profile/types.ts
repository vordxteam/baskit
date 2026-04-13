export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export interface UserProfile {
  id: number;
  user_id: number;
  bio: string | null;
  gender: Gender | null;
  date_of_birth: string | null;
  country: string | null;
  city: string | null;
  timezone: string | null;
  language: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserBasicInfo {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileResponseData {
  user?: UserBasicInfo;
  profile: UserProfile | null;
}

export interface GetProfileResponse {
  success: boolean;
  message?: string;
  data: ProfileResponseData;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  bio?: string;
  gender?: Gender;
  date_of_birth?: string; // YYYY-MM-DD
  country?: string;
  city?: string;
  timezone?: string;
  language?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile | null;
}

export interface DeleteProfileResponse {
  success: boolean;
  message: string;
}

export interface UploadProfileImageResponse {
  success: boolean;
  message: string;
  data: {
    profile_image: string;
  };
}

export interface RemoveProfileImageResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}