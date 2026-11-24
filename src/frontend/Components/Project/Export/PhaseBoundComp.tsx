import {DaltonPhase} from "../../../../shared/export";
import {ChangeEvent, Dispatch, SetStateAction} from "react";

interface Props {
    daltonPhases: DaltonPhase[];
    setDaltonPhases: Dispatch<SetStateAction<DaltonPhase[]>>
    idx: number;
}

const PhaseBoundComp = (props: Props) => {

    function changeMinimumBounds(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        props.setDaltonPhases((previousPhases: DaltonPhase[]) => {
            const phases: DaltonPhase[] = [...previousPhases];
            phases[props.idx] = [Number(e.target.value), phases[props.idx][1]];
            return phases;
        })
    }

    function changeMaximumBounds(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        props.setDaltonPhases((previousPhases: DaltonPhase[]) => {
            const phases: DaltonPhase[] = [...previousPhases];
            phases[props.idx] = [phases[props.idx][0], Number(e.target.value)];
            return phases;
        })
    }

    return (
        <div className="phase-bound">
            <p>{props.idx + 1}</p>
            <input type="number" min={0} onChange={changeMinimumBounds} value={props.daltonPhases[props.idx][0]}/>
            <input type="number" min={0} onChange={changeMaximumBounds} value={props.daltonPhases[props.idx][1]}/>
        </div>
    )

}

export default PhaseBoundComp;