import {useContext} from "react";
import {MallocStateContext, MallocDispatchContext} from "../../Contexts/Malloc/MallocStateContext";
import {MallocState} from "./MallocState";
import {MallocAction} from "../../Contexts/Malloc/Actions/MallocAction";

export function useMallocState(): MallocState { return useContext(MallocStateContext); }
export function useMallocDispatch(): React.Dispatch<MallocAction> | undefined { return useContext(MallocDispatchContext); }