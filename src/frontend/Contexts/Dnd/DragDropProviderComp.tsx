import {DragDropProvider} from "@dnd-kit/react";

interface Props {
    children: React.ReactNode;
}

const DragDropProviderComp = (props: Props) => {

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    function updateDragEndState(event: { operation; nativeEvent?: Event | undefined; canceled?: boolean; suspend?: () => { resume(): void; abort(): void; }; }) {
        const { source, target } = event.operation;

        if (source?.type === "student-card" && target?.type === "mentor-lesson") {
            // @todo
        }
    }

    return (
        <DragDropProvider
            onDragEnd={(event) => {
                updateDragEndState(event);
            }}>
            {props.children}
        </DragDropProvider>
    )

}

export default DragDropProviderComp;