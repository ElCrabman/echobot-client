import { Text, Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useState } from "react";

export default function DeletionModal({ remove, isOpen, onClose, children } : 
  { remove: () => Promise<void>, isOpen: boolean, onClose: () => void, children: String | undefined}) {

	const [ loading, setLoading ] = useState(false);

	const waitRemoval = async () => {
		setLoading(true);
		await remove();
		setLoading(false);
	};

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Warning</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete the <Text as='b'> {children} </Text> bot ?
          </ModalBody>

          <ModalFooter>
            <Button  variant='ghost' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='red' isLoading={loading} onClick={waitRemoval}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
}