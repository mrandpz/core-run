import { ajax } from "core-fe"
import { ProductListResponse } from "type/api"
import { message } from 'antd';

export const getProductList = (): Promise<Array<ProductListResponse>>=>{
  return ajax("POST","/api/product/list",{},null)
}

export const handleDelete = (request): Promise<{message:string}>=>{
  return ajax("POST","/api/product/delete",{},request)
}

export const getError = (): Promise<Array<ProductListResponse>>=>{
  return ajax("POST","/api/product/error",{},null)
}