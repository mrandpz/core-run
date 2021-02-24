export interface CurrentUserResponse {
  loggedIn: boolean;
  username: string | null;
}

export interface LoginRequestParams{
  username:string;
  password:string
}

export interface ProductListResponse {
  id:number;
  name: string;
  imgUrl: string;
  expired: boolean
}