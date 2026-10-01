import React from 'react';
import IconButton from './IconButton';
import { X } from 'lucide-react';

function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    widthClass = "w-50"
}) {
    if (!isOpen) return null;

    return (
        <div
            className="modal d-block bg-dark bg-opacity-50 position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className={`modal-dialog ${widthClass} m-0`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content shadow border-0">
                    <div className="modal-header p-3 justify-content-between align-items-center border-bottom-0">
                        {title && <h5 className="modal-title">{title}</h5>}
                        
                        <IconButton
                            onClick={onClose}
                            variant="default"
                            ariaLabel="Close modal"
                        >
                            <X size={20} />
                        </IconButton>
                    </div>

                    <div className="modal-body p-3 pt-0">
                        {children}
                    </div>

                    {footer && (
                        <div className="modal-footer p-3 border-top-0">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Modal;
