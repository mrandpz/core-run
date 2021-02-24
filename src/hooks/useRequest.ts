import React,{ useCallback, useEffect, useState } from "react";

export default (handle,{manual=false})=>{
  const [loading, setLoading] = useState(false);
  
  const run = useCallback(()=>{
    return new Promise((resolve)=>{
      setLoading(true);
      console.log(handle)
      handle().then(()=>{
        setLoading(false);
        resolve(true)
      });
    })
    
  },[])

  useEffect(()=>{
    if(!manual){
      run()
    }
  },[])

  return {loading,run}
}