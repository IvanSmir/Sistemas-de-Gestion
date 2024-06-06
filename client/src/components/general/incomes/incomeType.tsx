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
    Switch,
    Wrap,
    WrapItem,
    useToast
} from "@chakra-ui/react";
import { createIncomeType, updateIncomeType } from "@/utils/finance.http";
import { useAuth } from "@/components/context/AuthProvider";

interface IncomeType {
    id?: string;
    name: string;
    deductible: boolean;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSave: (incomeType: IncomeType) => void;
    initialData?: IncomeType | null;
}

export const IncomeType: React.FC<ModalProps> = ({ isOpen, onClose, onChange, onSave, initialData }) => {
    const toast = useToast();
    const { user } = useAuth();
    const [income, setIncomeType] = useState<IncomeType>({
        name: "",
        deductible: false,
    });

    useEffect(() => {
        if (initialData) {
            setIncomeType({
                id: initialData.id,
                name: initialData.name,
                deductible: initialData.deductible
            });
        } else {
            setIncomeType({ name: "", deductible: false });
        }
    }, [initialData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const updatedValue = type === 'checkbox' ? checked : value;
        setIncomeType({ ...income, [name]: updatedValue });
        onChange(e);
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const token = user?.token || "";

        if (income.name.trim().length > 0) {
            try {
                const data = {
                    name: income.name,
                    deductible: income.deductible,
                };

                toast.closeAll();
                const loadingToast = toast({
                    title: "Guardando",
                    description: "Por favor espere...",
                    status: "loading",
                    duration: null,
                    isClosable: true,
                });

                if (income.id) {
                    // Update existing income type
                    const response = await updateIncomeType(income.id, data, token);
                    onSave(response);
                    toast.close(loadingToast);
                    toast({
                        title: "Guardado",
                        description: "Tipo de ingreso actualizado con éxito",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    // Create new income type
                    const response = await createIncomeType(data, token);
                    onSave(response);
                    toast.close(loadingToast);
                    toast({
                        title: "Guardado",
                        description: "Tipo de ingreso creado con éxito",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                }

                setIncomeType({ name: "", deductible: false });
                onClose();
            } catch (error) {
                toast.closeAll();
                toast({
                    title: "Error",
                    description: "Error al guardar el tipo de ingreso",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                console.error("Error al guardar el tipo de ingreso:", error);
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
        <Modal isOpen={isOpen} onClose={onClose} size="" isCentered>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
            <ModalContent maxW="400px">
                <ModalHeader>
                    <Text fontSize="24px" mb={6} textAlign="center" color="#AA546D">
                        {income.id ? "Editar Tipo de Ingreso" : "Crear Tipo de Ingreso"}
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
                                    value={income.name}
                                    borderRadius="sm"
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Flex>
                        <Wrap>
                            <WrapItem>
                                <FormControl>
                                    <FormLabel htmlFor="deductible">Es deducible:</FormLabel>
                                    <Switch
                                        id="deductible"
                                        name="deductible"
                                        isChecked={income.deductible}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </WrapItem>
                        </Wrap>
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

