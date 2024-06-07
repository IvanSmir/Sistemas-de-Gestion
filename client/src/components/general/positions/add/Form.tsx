'use client'
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Select, Text, useToast } from '@chakra-ui/react';
import Position from "@/types/position";
import { addPosition } from "@/utils/position.utils";
import { useAuth } from "@/components/context/AuthProvider";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import Relative from "@/types/relative";
import { formSchema } from '@/validations/formSchema';
import { Form } from '@/components/relatives/add/Form';

interface PositionForm {
    id?: string;
    name: string;
    description: string;

}
interface FormAddPositionProps {
    isOpen: boolean;
    onClose: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSave: (position: Position) => void;

}
export const FormAddPosition: React.FC<FormAddPositionProps> = ({ isOpen, onClose, onChange, onSave }) => {
    const router = useRouter();
    const toast = useToast();
    const [error, setError] = useState<string | null>(null);
    const auth = useAuth();
    const { user } = useAuth();
    const { register } = useForm()
    const [position, setPosition] = useState<PositionForm>(
        {
            name: "",
            description: "",

        }
    );
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        let value = target.value;
        setPosition({ ...position, [target.name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const token = user?.token ?? "";
        if (position.description.trim().length <= 100 && position.name.trim().length > 3 && position.name.trim().length <= 50) {
            try {
                const savedPosition = await addPosition(position, token);
                if (savedPosition) console.log(savedPosition)
                onSave(savedPosition);
                toast({
                    title: 'Guardado',
                    description: 'Se ha guardado correctamente',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                router.push('/general/positions');

            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Error al cargar el cargo',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } else {
            if (position.name.trim().length < 3) {
                toast({
                    title: 'Error',
                    description: 'El nombre del cargo necesita por lo menos 3 caracteres',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
            if (position.name.trim().length > 50) {
                toast({
                    title: 'Error',
                    description: 'El nombre puede tener hasta 50 caracteres',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
            if (position.description.trim().length > 100) {
                toast({
                    title: 'Error',
                    description: 'La descripcion puede tener hasta 100 caracteres',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <>
            <Flex width={"90%"} flexDirection={"column"}>
                <Heading color={"gray.600"} marginLeft={5} width={"100%"}>Agregar Cargo</Heading>

                <Flex justify="center" mt={20} width={"90%"} minH="90vh">
                    <form className='w-[60%]' onSubmit={() => { }}>
                        <Flex flexDirection={"column"} gap={10}>


                            <FormControl width={"100%"}>
                                <FormLabel htmlFor="name" >Nombre:</FormLabel>
                                <Input
                                    w={"100%"}
                                    type="text"
                                    id="name"
                                    {...register('name')}
                                    onChange={handleChange}
                                    value={position.name}
                                />
                            </FormControl>
                            <FormControl mb={10}>
                                <FormLabel htmlFor="description" >Descripción:</FormLabel>
                                <Input
                                    type="text"
                                    id="description"
                                    {...register('description')}
                                    onChange={handleChange}
                                    value={position.description}
                                />
                            </FormControl>
                        </Flex>
                        <Flex width={"100%"} justifyContent={"center"} mt={10}>
                            <Link href="/general/positions">
                                <Button variant="ghost" onClick={onClose} mr={3}>
                                    Cancelar
                                </Button>
                            </Link>

                            <Button color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} mr={3} onClick={(e) => { handleSubmit(e) }}>
                                Guardar
                            </Button>


                        </Flex>

                    </form >
                </Flex>

            </Flex>

        </>

    )
}