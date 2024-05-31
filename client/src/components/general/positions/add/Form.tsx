'use client'
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Input, Select, Text, useToast } from '@chakra-ui/react';
import Position from "@/types/position";
import { addPosition } from "@/utils/position.utils";
import { useAuth } from "@/components/context/AuthProvider";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import Relative from "@/types/relative";
import { formSchema } from '@/validations/formSchema';

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
    const {register} = useForm()
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
        if(position.description.trim().length <= 50 && position.name.trim().length > 3 && position.name.trim().length <= 25){
            try {
                const savedPosition = await addPosition(position, token);
                if(savedPosition) console.log(savedPosition)
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
        }else{
            if(position.name.trim().length < 3){
                toast({
                    title: 'Error',
                    description: 'El nombre del cargo necesita por lo menos 3 caracteres',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
            if(position.name.trim().length > 25){
                toast({
                    title: 'Error',
                    description: 'El nombre puede tener hasta 25 caracteres',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
            if(position.description.trim().length > 50){
                toast({
                    title: 'Error',
                    description: 'La descripcion puede tener hasta 50 caracteres',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };

    return (
        <Flex justify="center" align="center" minH="90vh">
            <Box bg="white" p={5} borderRadius="md" boxShadow="md" width="90%">
                <Text fontSize='24px' mb={6} textAlign="center" color="#AA546D"> Agregar Cargo</Text>

                <form onSubmit={()=>{}}>

                    <FormControl>
                        <FormLabel htmlFor="name" >Nombre:</FormLabel>
                        <Input
                            type="text"
                            id="name"
                            {...register('name')} 
                            onChange={handleChange}
                            value={position.name}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="description" >Descripción:</FormLabel>
                        <Input
                            type="text"
                            id="description"
                            {...register('description')} 
                            onChange={handleChange}
                            value={position.description}
                        />
                    </FormControl>
                    <Flex mt={4}>
                        <Link href="/general/positions">
                            <Button variant="ghost" onClick={onClose} mr={3}>
                                Cancelar
                            </Button>
                        </Link>
                        
                        <Button color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} mr={3} onClick={(e)=>{handleSubmit(e)}}>
                            Guardar
                        </Button>
                        
                        
                    </Flex>

                </form >
            </Box>
        </Flex  >
    )
}