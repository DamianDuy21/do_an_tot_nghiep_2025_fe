import { cloneElement, useState } from "react";

const CostumedModal = ({ trigger, title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (e) => {
    e?.stopPropagation?.();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const triggerWithHandler = cloneElement(trigger, {
    onClick: handleOpen,
  });

  return (
    <>
      {triggerWithHandler}
      {isOpen && (
        <div className="modal modal-open fixed inset-0 flex items-center justify-center z-50 bg-opacity-40">
          <div className="modal-box relative bg-base-100">
            <button
              className="btn btn-sm btn-circle rounded-card btn-ghost absolute right-4 top-4"
              onClick={handleClose}
            >
              ✕
            </button>
            {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}
            {typeof children === "function"
              ? children({ close: handleClose })
              : children}
          </div>
        </div>
      )}
    </>
  );
};

export default CostumedModal;
