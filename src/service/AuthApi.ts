import {ajax} from "core-fe";
import {CurrentUserResponse,LoginRequestParams} from 'type/api'

export const login = (request:LoginRequestParams): Promise<CurrentUserResponse>=>{
  return ajax("POST","/api/login",{},request)
}

export const logout = (): Promise<void>=>{
  return ajax("POST","/api/logout",{},null)
}

export const getCurrentUser = (): Promise<CurrentUserResponse>=>{
  return ajax("POST","/api/currentUser",{},null)
}


