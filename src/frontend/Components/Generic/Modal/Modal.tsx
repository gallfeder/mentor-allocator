import "./Modal.css"
import type { ReactNode } from "react";

export type ModalSize = "modal-large" | "modal-medium" | "modal-s-medium" | "modal-small";

interface Props {
    header?: ReactNode,
    children: ReactNode,
    footer?: ReactNode,
    modalSize: ModalSize,
    onClosed: () => void
}

const Modal = (props: Props) => {

    return (
        <div onClick={props.onClosed} className="modal-background">
            <div onClick={(e) => e.stopPropagation()} className={`${props.modalSize} modal-container`}>
                <div className="modal-header">
                    { props.header && props.header }
                    <button onClick={props.onClosed} className="modal-close-button">&times;</button>
                </div>
                <div className="modal-body scroller">
                    { props.children }
                </div>
                { props.footer && (
                    <div className="modal-footer">
                        { props.footer }
                    </div>
                ) }
            </div>
        </div>
    )

}

export default Modal;