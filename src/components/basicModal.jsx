import {
  Modal,
  ModalContent,
  ModalBody,
} from "@heroui/react";

export default function BasicModal({ isOpen, onOpenChange, Content, size = "md", scrollBehavior="normal", isDismissable = true }) {

  return (
    <Modal
        size={size}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        scrollBehavior={scrollBehavior}
        isDismissable={isDismissable}
        classNames={{
          body: "py-8",
          backdrop: "bg-black/60 backdrop-opacity-90",
          base: "border-gray-200 bg-white text-gray-900",
          header: "border-b-[1px] border-gray-200",
          footer: "border-t-[1px] border-gray-200",
          closeButton: "hover:bg-gray-100 active:bg-gray-200 cursor-pointer w-8 h-8 md:w-6 md:h-6",
        }}
        >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <Content />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}