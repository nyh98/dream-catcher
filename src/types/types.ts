export type TemplateType = 'Beginner' | 'Expert' | 'Free';

export const templateTpyes: TemplateType[] = ['Beginner', 'Expert', 'Free'];

export interface KakaoAuthResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

export interface DecodedKakaoToken {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image: string;
    thumbnail_image: string;
  };
  kakao_account: {
    profile_nickname_needs_agreement: boolean;
    profile_image_needs_agreement: boolean;
    profile: {
      nickname: string;
      thumbnail_image_url: string;
      profile_image_url: string;
      is_default_image: boolean;
      is_default_nickname: boolean;
    };
  };
}

export interface TokenData {
  expiresInMillis: number;
  id: number;
  expires_in: number;
  app_id: number;
  appId: number;
}

export interface RefreshKakaoTorkenRes {
  access_token: string;
  token_type: 'bearer';
  refresh_token?: string; //optional
  refresh_token_expires_in?: 5184000; //optional
  expires_in: 43199;
}
