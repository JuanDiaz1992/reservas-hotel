import {
  Modal,
  ModalContent,
  ModalBody,
} from "@heroui/react";

export default function BasicModal({ isOpen, onOpenChange, Content, size = "md", scrollBehavior="normal" }) {

  return (
    <Modal
        size={size}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque"
        scrollBehavior={scrollBehavior}
        classNames={{
          body: "py-6",
          backdrop: "bg-black/60 backdrop-opacity-90",
          base: "border-gray-200 bg-white text-gray-900",
          header: "border-b-[1px] border-gray-200",
          footer: "border-t-[1px] border-gray-200",
          closeButton: "hover:bg-gray-100 active:bg-gray-200 cursor-pointer",
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