"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { motion } from "framer-motion";

export default function ConfirmDelete({ isOpen, onClose, onConfirm }: any) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center" size="sm">
      <ModalContent>
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="text-center py-6"
        >
          <ModalHeader className="flex flex-col items-center gap-2">
            <div className="text-4xl text-red-500">⚠️</div>
            <span className="text-lg font-bold">حذف محصول</span>
          </ModalHeader>

          <ModalBody>
            <p className="text-gray-600">آیا از حذف این محصول اطمینان دارید؟</p>
          </ModalBody>

          <ModalFooter className="flex justify-center gap-4">
            <Button variant="flat" onPress={onClose}>
              لغو
            </Button>
            <Button color="danger" onPress={onConfirm}>
              بله، حذف کن
            </Button>
          </ModalFooter>
        </motion.div>
      </ModalContent>
    </Modal>
  );
}
