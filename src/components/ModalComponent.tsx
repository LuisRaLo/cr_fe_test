interface ModalProps {
  readonly isOpen: boolean;
  readonly title?: string;
  readonly children?: React.ReactNode;

  readonly onClose?: () => void;
}

export default function ModalComponent({
  isOpen,
  title,
  onClose,
  children,
}: ModalProps): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,.8)] bg-opacity-50`}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 space-y-4 w-full max-w-lg">
        <div className="flex">
          {title && <h2 className="text-xl font-bold">{title}</h2>}

          {onClose && (
            <div className="ml-auto">
              <button
                type="button"
                onClick={() => onClose()}
                className="px-2 text-gray-500 rounded-full hover:bg-gray-100"
              >
                X
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-6">{children}</div>
      </div>
    </div>
  );
}
