import {ajax} from "core-fe";

export const hello = ()=>{
  return ajax("POST","/api/hello",{},null)
}

export const helloWrold = ()=>{
  return ajax("GET","/api/helloworld",{},null)
}