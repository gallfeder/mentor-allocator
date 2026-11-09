import {MallocState} from "./MallocState";
import {MallocAction} from "../../Contexts/Malloc/Actions/MallocAction";
import initProjectsAction from "../../Contexts/Malloc/Actions/Projects/InitProjectsAction";

function mallocReducer(state: MallocState, action: MallocAction): MallocState {

    switch (action.type) {
        case "INIT_PROJECTS":
            return initProjectsAction(state, action.payload);
    }

}

export default mallocReducer;