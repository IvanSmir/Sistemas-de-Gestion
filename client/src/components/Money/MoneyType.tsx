'use client'
import React, { ChangeEvent, FormEvent, useState, useEffect, use } from "react";
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

import {useAuth} from "@/components/context/AuthProvider"
import { createConfigAmountType, updateConfigAmountType } from "@/utils/configBasic.http";

interface AmountType{
    id?:string;
    name:string;
    value:number;
}

interface ModalProps{
    isOpen:boolean;
    onClose:()=>void;
    onChange:(e:ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>void;
    onSave:(AmountType:AmountType)=>void;
    initialData?:AmountType|null;
}

export const AmountType : React.FC<ModalProps> = ({ isOpen, onClose, onChange, onSave, initialData })=>{
    const toast = useToast();
    const {user} = useAuth();
    const [amount, setAmount] = useState<AmountType>({
        name: "",
        value: 0,
    });

    useEffect(()=>{
        if(initialData){
            setAmount(initialData);
        }else{
            setAmount({name:"", value:0});
        }
    },[initialData])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
        setAmount({ ...amount, [target.name]: value });
        onChange(e);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const token = user?.token || "";
        console.log('token autorizado:',token)

        if (amount.name.trim().length > 0) {
            try {
                const data = {
                    name: amount.name,
                    value: amount.value,
                };

                toast.closeAll();
                const loadingToast = toast({
                    title: "Guardando",
                    description: "Por favor espere...",
                    status: "loading",
                    duration: null,
                    isClosable: true,
                });

                if (amount.id) {
                    // Update existing amount type
                    const response = await updateConfigAmountType(amount.id, data, token);
                    onSave(response);
                    toast.close(loadingToast);
                    toast({
                        title: "Guardado",
                        description: "El tipo de monto se edito exitosamente",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                } else {
                    // Create new amount type
                    const response = await createConfigAmountType(data, token);
                    onSave(response);
                    toast.close(loadingToast);
                    toast({
                        title: "Guardado",
                        description: "Tipo de monto creado con éxito",
                        status: "success",
                        duration: 5000,
                        isClosable: true,
                    });
                }

                setAmount({ name: "", value: 0});
                onClose();
            } catch (error) {
                toast.closeAll();
                toast({
                    title: "Error",
                    description: "Error al guardar el tipo de monto",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                console.error("Error al guardar el tipo de monto:", error);
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


    return(
        <Modal isOpen={isOpen} onClose={onClose} size="" isCentered>
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
            <ModalContent maxW="400px">
                <ModalHeader>
                    <Text fontSize="24px" mb={6} textAlign="center" color="#AA546D">
                        {amount.id ? "Editar Tipo de monto" : "Crear Tipo de monto"}
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
                                    value={amount.name}
                                    borderRadius="sm"
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="value">Monto:</FormLabel>
                                <Input
                                    type="text"
                                    id="value"
                                    name="value"
                                    value={amount.value}
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
}