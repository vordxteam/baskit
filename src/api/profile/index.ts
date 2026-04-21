import apiClient from "../core/apiClient";
import type {
  GetProfileResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
  DeleteProfileResponse,
  UploadProfileImageResponse,
  RemoveProfileImageResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "./types";

export class ProfileApi {
  /**
   * Get logged-in user profile
   */
  async getProfile<TResponse = GetProfileResponse>(): Promise<TResponse> {
    return apiClient.get<TResponse>("/api/profile");
  }

  /**
   * Update logged-in user profile
   */
  async updateProfile<TResponse = UpdateProfileResponse>(
    payload: UpdateProfilePayload
  ): Promise<TResponse> {
    return apiClient.put<TResponse>("/api/profile", payload);
  }

  /**
   * Delete logged-in user profile
   * Only add this if your backend supports it
   */
  async deleteProfile<TResponse = DeleteProfileResponse>(): Promise<TResponse> {
    return apiClient.delete<TResponse>("/api/profile");
  }

  /**
   * Upload profile image
   * Only add this if your backend supports it
   */
  async uploadProfileImage<TResponse = UploadProfileImageResponse>(
    file: File
  ): Promise<TResponse> {
    const formData = new FormData();
    formData.append("profile_image", file);

    return apiClient.post<TResponse>("/api/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  /**
   * Remove profile image
   * Only add this if your backend supports it
   */
  async removeProfileImage<TResponse = RemoveProfileImageResponse>(): Promise<TResponse> {
    return apiClient.delete<TResponse>("/api/profile/image");
  }

  /**
   * Change password
   * Only add this if your backend supports it
   */
  async changePassword<TResponse = ChangePasswordResponse>(
    payload: ChangePasswordPayload
  ): Promise<TResponse> {
    return apiClient.put<TResponse>("/api/profile/change-password", payload);
  }

  /**
   * Upload profile avatar image
   * POST /api/profile/avatar
   */
  async uploadProfileAvatar<TResponse = UploadProfileImageResponse>(
    file: File
  ): Promise<TResponse> {
    const formData = new FormData();
    formData.append("avatar", file);

    return apiClient.post<TResponse>("/api/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export const profileApi = new ProfileApi();