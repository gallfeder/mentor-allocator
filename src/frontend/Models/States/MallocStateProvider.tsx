import {ReactNode, useReducer} from "react";
import MallocReducer from "./MallocReducer";
import {MallocDefaultState} from "./MallocState";
import {MallocDispatchContext, MallocStateContext} from "../../Contexts/Malloc/MallocStateContext";

const MallocStateProvider = (props: { children: ReactNode }) => {

    const [state, dispatch] = useReducer(MallocReducer, MallocDefaultState);

    return (
        <MallocStateContext.Provider value={state}>
            <MallocDispatchContext value={dispatch}>
                { props.children }
            </MallocDispatchContext>
        </MallocStateContext.Provider>
    )

}

export default MallocStateProvider;