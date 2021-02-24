import { State } from 'core-fe/';
import React from 'react';
import { useSelector } from 'react-redux';

export default (moduleStateName)=>{
  const state = useSelector((state: State) => state.app[moduleStateName]);
  return state
}