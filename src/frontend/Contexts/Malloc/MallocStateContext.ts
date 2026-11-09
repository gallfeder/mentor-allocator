import {createContext, Dispatch} from "react";
import {MallocDefaultState, MallocState} from "../../Models/States/MallocState";
import {MallocAction} from "./Actions/MallocAction";

export const MallocStateContext = createContext<MallocState>(MallocDefaultState);
export const MallocDispatchContext = createContext<Dispatch<MallocAction> | undefined>(undefined);