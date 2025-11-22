import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function MyModal({ children, title, isOpen, onClose }: Props) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
      <AnimatePresence>
        {isOpen && (
          <ModalContent>
            {(close) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                <ModalHeader className="flex flex-col gap-1 text-gray-800 text-2xl font-bold">{title}</ModalHeader>
                <ModalBody>{children}</ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      close();
                      onClose();
                    }}
                  >
                    بستن
                  </Button>
                </ModalFooter>
              </motion.div>
            )}
          </ModalContent>
        )}
      </AnimatePresence>
    </Modal>
  );
}
