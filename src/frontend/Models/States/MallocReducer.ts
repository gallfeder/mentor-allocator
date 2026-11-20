import {MallocState} from "./MallocState";
import {MallocAction} from "../../Contexts/Malloc/Actions/MallocAction";
import initProjectsAction from "../../Contexts/Malloc/Actions/Projects/InitProjectsAction";
import initProjectAction from "../../Contexts/Malloc/Actions/Projects/InitProjectAction";
import allocStudentsAction from "../../Contexts/Malloc/Actions/MentorLesson/AllocStudentsAction";
import createMentorLessonOptimisticAction from "../../Contexts/Malloc/Actions/MentorLesson/CreateMentorLessonOptimisticAction";
import createMentorLessonSucceededAction
    from "../../Contexts/Malloc/Actions/MentorLesson/CreateMentorLessonSucceededAction";
import deleteMentorLessonAction from "../../Contexts/Malloc/Actions/MentorLesson/DeleteMentorLessonAction";

function mallocReducer(state: MallocState, action: MallocAction): MallocState {

    switch (action.type) {
        case "INIT_PROJECTS":
            return initProjectsAction(state, action.payload);
        case "INIT_PROJECT":
            return initProjectAction(state, action.payload);
        case "CREATE_MENTOR_LESSON_OPTIMISTIC":
            return createMentorLessonOptimisticAction(state, action.payload);
        case "CREATE_MENTOR_LESSON_SUCCEEDED":
            return createMentorLessonSucceededAction(state, action.payload);
        case "CREATE_MENTOR_LESSON_FAILED":
            return deleteMentorLessonAction(state, action.payload);
        case "ALLOC_STUDENTS":
            return allocStudentsAction(state, action.payload);
    }

}

export default mallocReducer;