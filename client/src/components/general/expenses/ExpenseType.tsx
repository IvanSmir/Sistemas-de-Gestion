import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Input,
    Flex,
    Text,
    useToast
} from "@chakra-ui/react";
import { createExpenseType, updateExpenseType } from "@/utils/finance.http";
import { useAuth } from "@/components/context/AuthProvider";

interface ExpenseType {
    id?: string;
    name: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSave: (expenseType: ExpenseType) => void;
    initialData?: ExpenseType | null;
}

export const ExpenseType: React.FC<ModalProps> = ({ isOpen, onClose, onChange, onSave, initialData }) => {
    const toast = useToast();
    const { user } = useAuth();
    const [expense, setExpenseType] = useState<ExpenseType>({
        name: ""
    });

    useEffect(() => {
        if (initialData) {
            setExpenseType(initialData);
        } else {
            setExpenseType({ name: "" });
        }
    }, [initialData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
        setExpenseType({ ...expense, [target.name]: value });
        onChange(e);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const token = user?.token || "";

        if (expense.name.trim().length > 0) {
            try {
                const data = {
                    name: expense.name,
                };

                toast.closeAll();
                const loadingToast = toast({
                    title: "Guardando",
                    description: "Por favor espere...",
                    status: "loading",
                    duration: null,
                    isClosable: true,
                });

                if (expense.id) {
                    // Update existing expense type
                    const response = await updateExpenseType(expense.id, data, token);
                    onSave(response);
                    toast.close(loadingToast);
                    toast({
                        title: "Guardado",
                        description: "Tipo de egreso actualizado con éxito",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    const response = await createExpenseType(data, token);
                    onSave(response);
                    toast.close(loadingToast);
                    toast({
                        title: "Guardado",
                        description: "Tipo de egreso creado con éxito",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                }

                setExpenseType({ name: "" });
                onClose();
            } catch (error) {
                toast.closeAll();
                toast({
                    title: "Error",
                    description: "Error al guardar el tipo de egreso",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                console.error("Error al guardar el tipo de egreso:", error);
            }
        } else {
            toast({
                title: "Error",
                description: "Ingrese un nombre válido",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
            <ModalContent maxW="400px">
                <ModalHeader>
                    <Text fontSize="24px" mb={6} textAlign="center" color="#AA546D">
                        {expense.id ? "Editar Tipo de Egreso" : "Crear Tipo de Egreso"}
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form>
                        <Flex direction={{ base: "column", md: "row" }} gap={4} mb={4}>
                            <FormControl>
                                <FormLabel htmlFor="name">Nombre:</FormLabel>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={expense.name}
                                    borderRadius="sm"
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Flex>
                        <ModalFooter>
                            <Button variant="ghost" onClick={onClose} mr={3}>
                                Cancelar
                            </Button>
                            <Button color="white" bgColor="#AA546D" _hover={{ bgColor: "#c1738e" }} mr={3} onClick={handleSubmit}>
                                Guardar
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
