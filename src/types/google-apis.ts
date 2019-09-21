export interface UserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  picture: string;
  hd: string;
}

export type UserAndToken = { authToken: string; userInfo: UserInfo };
