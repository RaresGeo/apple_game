import React from 'react';
import { CgClose } from '@react-icons/all-files/cg/CgClose';

interface Props {
  children: React.ReactNode;
  closeModal: () => void;
}

const Modal: React.FC<Props> = ({ children, closeModal }) => {
  const close = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    closeModal();
  };

  return (
    <div
      className="bg-black/75 h-screen w-screen fixed top-0 left-0 flex flex-col justify-center items-center z-40"
      onClick={close}
    >
      <div
        className="h-fit w-fit py-6 px-10 rounded-md rounded-tr-none shadow-xl bg-quaternary flex flex-col justify-evenly z-50 relative text-secondary"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
          e.stopPropagation();
        }}
      >
        <div
          onClick={close}
          className="w-fit h-fit absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 transition-transform rotate-12 hover:rotate-180 bg-secondary cursor-pointer "
        >
          <CgClose className="text-white h-8 w-8 p-1" />
        </div>

        {children}
      </div>
    </div>
  );
};

export default Modal;
