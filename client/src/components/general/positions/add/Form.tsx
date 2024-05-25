'use client'
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { ChangeEvent, FormEvent, useState } from 'react';
import { Box, Button, Flex, FormControl, FormLabel, Input, Select, Text } from '@chakra-ui/react';
import Position from "@/types/position";
import { addPosition } from "@/utils/position.utils";
import { useAuth } from "@/components/context/AuthProvider";
import Link from "next/link";

interface PositionForm {
    id?: number;
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
    const { user } = useAuth();
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
        if(position.description.trim().length > 0 && position.name.trim().length > 0){
            try {
                const savedPosition = await addPosition(position, token);
                if(savedPosition) console.log(savedPosition)
                onSave(savedPosition);
                alert('Se ha guardado correctamente');
                router.push('/general/positions');
                
            } catch (error) {
                console.error("Error al guardar el cargo:", error);
            }
        }else{
           
            console.error("Ingrese todos los datos")
        }
    };

    return (
        <Flex justify="center" align="center" minH="90vh">
            <Box bg="white" p={5} borderRadius="md" boxShadow="md" width="90%">
                <Text fontSize='24px' mb={6} textAlign="center" color="#AA546D"> Agregar Cargo</Text>

                <form >

                    <FormControl>
                        <FormLabel htmlFor="name" >Nombre:</FormLabel>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            onChange={handleChange}
                            value={position.name}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel htmlFor="description" >Descripción:</FormLabel>
                        <Input
                            type="text"
                            id="description"
                            name="description"
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