export interface UserProfile       { name: string; phone: string; email: string; profileImage?: string; }
export interface SecuritySettings  { biometricEnabled: boolean; pinEnabled: boolean; patternEnabled: boolean; lastPasswordChanged?: string; }
export interface NotifSetting      { id: string; label: string; description?: string; enabled: boolean; }
export interface SocialAccount     { provider: 'google' | 'apple'; isLinked: boolean; email?: string; }
export interface OtpResult         { expiresIn: number; }
