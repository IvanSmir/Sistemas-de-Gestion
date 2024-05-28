'use client';
import React, { useState, useEffect, ChangeEvent } from "react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import {
    Box,
    Flex,
    Input,
    Select,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useDisclosure
} from "@chakra-ui/react";
import { FormAddPosition } from "./add/Form";
import Link from "next/link";
import { deletePosition, getPositions } from "@/utils/position.utils";
import { useAuth } from "@/components/context/AuthProvider";

interface Position {
    id: string,
    name: string,
    description: string
}

export const ListPositions: React.FC = () => {

    const { user } = useAuth();

    const [positions, setPositions] = useState<Position[]>([]);
    const [filters, setFilters] = useState<{ name: string }>({
        name: '',
    });
    const [fetchTrigger, setFetchTrigger] = useState<boolean>(false)

    const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();



    useEffect(() => {
        getPositions().then(a=>{
            setFilteredPositions(a.data)
            console.log(a.data)
        })
    }, [filters, fetchTrigger]);

    const handleNameFilter = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, name: e.target.value });
    };

    const handleAddPosition = () => {
        onAddOpen();
    };

    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    const handleEditClick = (position: Position, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedPosition(position);
        onEditOpen();
    };



    const handleRowClick = (position: Position) => {
        setSelectedPosition(position);
        onOpen();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (selectedPosition) {
            const { name, value } = e.target;
            setSelectedPosition({ ...selectedPosition, [name]: value });
        }
    };

    const handleSave = (newPosition: Position) => {
        setPositions([...positions, newPosition]);
        onAddClose();
    };

    const handleDeleteClick = (id:string, e: React.MouseEvent) => {
        e.stopPropagation()
        if(confirm("Desea borrar la posicion???")){
            if(!!user?.token){
                deletePosition(id, user.token).then(d=>{
                    alert("Se ha eliminado con exito")
                    setFetchTrigger(!fetchTrigger)
                }).catch(e=>alert("NO se ha podido eliminar"))
            }
        }
    }

    return (
        <Box backgroundColor={'white'} top={160} left={300} width={900} height={426} borderRadius="2xl" padding="8px" margin="auto" >
            <Flex justifyContent="space-between" mb={6} >
                <Flex gap={2}>
                    <Input
                        placeholder="Nombre"
                        value={filters.name}
                        onChange={handleNameFilter}
                        rounded={15}
                        background='white'
                        color='gray.600'
                        _hover={{ bg: "gray.100" }}
                    />
                </Flex>
                <Link href="positions/add">
                    <Button rounded={23} mr={5} fontSize={13} py={3} px={5} bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} gap={2} color='white'>
                        <AddIcon />Agregar Cargo
                    </Button>
                </Link>
            </Flex>
            <TableContainer className='overflow-y-auto'>
                <Table variant="simple" fontSize="14px">
                    <Thead>
                        <Tr>
                            <Th>Nombre</Th>
                            <Th>Descripcion</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredPositions.map((position, index) => (
                            <Tr key={index} onClick={() => handleRowClick(position)} style={{ cursor: 'pointer' }}>
                                <Td>{position.name}</Td>
                                <Td>{position.description}</Td>
                                <Td>
                                    <EditIcon mr={2} cursor="pointer" onClick={(event) => handleEditClick(position, event)} />
                                    <DeleteIcon cursor="pointer" onClick={(event) => handleDeleteClick(position.id, event)} />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>

    );
};