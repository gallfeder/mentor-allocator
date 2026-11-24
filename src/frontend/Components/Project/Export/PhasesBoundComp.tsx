import {Dispatch, SetStateAction} from "react";
import {DaltonPhase} from "../../../../shared/export";
import PhaseBoundComp from "./PhaseBoundComp";

interface Props {
    daltonPhases: DaltonPhase[];
    setDaltonPhases: Dispatch<SetStateAction<DaltonPhase[]>>
}

const PhasesBoundComp = (props: Props) => {

    function addDaltonPhase() {
        const latest: number = props.daltonPhases[props.daltonPhases.length - 1][1] ?? 0;
        props.setDaltonPhases((previous: DaltonPhase[]) => {
            return [...previous, [latest + 1, latest + 2]];
        })
    }

    return (
        <div className="phases-bounds">
            {props.daltonPhases.map((_, idx: number) => {
                return <PhaseBoundComp key={idx} idx={idx} daltonPhases={props.daltonPhases} setDaltonPhases={props.setDaltonPhases}/>
            })}
            <button onClick={addDaltonPhase} className="phase-bound-add button normal">+</button>
        </div>
    )

}

export default PhasesBoundComp;