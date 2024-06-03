'use client';
import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
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
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    ModalBody,
    ModalHeader,
    ModalFooter,
    useToast
} from "@chakra-ui/react";
import { FormAddPosition } from "./add/Form";
import Link from "next/link";
import { deletePosition, editPosition, getPosition, getPositions } from "@/utils/position.utils";
import { useAuth } from "@/components/context/AuthProvider";
import { useForm } from "react-hook-form";
interface Position {
    id: string,
    name: string,
    description: string
}

export const ListPositions: React.FC = () => {

    const toast = useToast()
    const { user } = useAuth();
    const {register} = useForm()
    const [positions, setPositions] = useState<Position[]>([]);
    const [selectedPos, setSelectedPos] = useState<Position | null>(null)
    const [baseSelectedPos, setBaseSelectedPos] = useState<Position | null>(null)
    const [totalPages, setTotalPages] = useState<number>(1)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [filters, setFilters] = useState<{ name: string }>({
        name: '',
    });
    const [fetchTrigger, setFetchTrigger] = useState<boolean>(false)

    const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);

    const [deleteId, setDeleteId] = useState<string>("")

    useEffect(() => {
        getPositions(currentPage).then(a => {
            setFilteredPositions(a.data)
            setTotalPages(a.totalPages)
        })
        if(filters.name.trim().length > 0){
            getPosition(filters.name)
                .then(e=>{
                    if(e) setFilteredPositions([e])
                })
        }
    }, [filters, fetchTrigger, currentPage]);

    const handleNameFilter = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, name: e.target.value });
    };

    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isEditConfirmOpen, onOpen: onEditConfirmOpen, onClose: onEditConfirmClose } = useDisclosure();
    const { isOpen: isDeleteConfirmOpen, onOpen: onDeleteConfirmOpen, onClose: onDeleteConfirmClose } = useDisclosure();

    const handleEditClick = (position: Position, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedPos(position);
        setBaseSelectedPos(position)
        onEditOpen();
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        
            if (!!user?.token) {
                deletePosition(deleteId, user.token).then(d => {
                    setFetchTrigger(!fetchTrigger)
                    toast({
                        title: 'Eliminado',
                        description: 'Se ha eliminado correctamente',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                    onDeleteConfirmClose()
                }).catch(e => {toast({
                    title: 'Error',
                    description: 'Error al borrar el Cargo',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });})
            }
        
    }

    const handleCloseModal = () =>{
        onEditClose()
        setSelectedPos(null)
        setBaseSelectedPos(null)
    }

    const handleEditPosition = () => {
        onEditConfirmClose()
            if(selectedPos && user){
                if(selectedPos?.name !== baseSelectedPos?.name || selectedPos?.description !== baseSelectedPos?.description){
                    if(selectedPos?.name.trim().length<3){
                        return toast({
                            title: 'Error',
                            description: 'El nombre debe ser mayor a 3 caracteres',
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                    if(selectedPos?.name.trim().length > 50){
                        return toast({
                            title: 'Error',
                            description: 'El nombre debe ser menor a 50 caracteres',
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                    if(selectedPos?.description.trim().length>100){
                        return toast({
                            title: 'Error',
                            description: 'La descripcion debe ser menor a 100 caracteres',
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                    editPosition(selectedPos.id, {
                        name: selectedPos.name,
                        description: selectedPos.description
                    }, user.token)
                        .then(e=>{
                            handleCloseModal()
                            setFetchTrigger(!fetchTrigger)
                            toast({
                                title: 'Success',
                                description: 'Se ha editado con exito',
                                status: 'success',
                                duration: 5000,
                                isClosable: true,
                            });
                        })
                }else{
                    toast({
                        title: 'Error',
                        description: 'No hubo cambios',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            }
    }   

    return (
        <>
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
                                <Tr key={index} onClick={() => {}} >
                                    <Td>{position.name}</Td>
                                   
                                    <Td>{position.description}</Td>
                                    <Td>
                                        <EditIcon mr={2} cursor="pointer" onClick={(event) => handleEditClick(position, event)} />
                                        <DeleteIcon cursor="pointer" onClick={()=>{
                                            setDeleteId(position.id)
                                            onDeleteConfirmOpen()
                                        }} />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Pagination page={currentPage} setPage={setCurrentPage} total={totalPages} />
            </Box>
            <Modal isOpen={isEditOpen} onClose={handleCloseModal} size="2xl" isCentered>
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
                <ModalContent>
                    <ModalHeader>Editar Posicion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <Flex gap={2} flexDirection={"column"}>
                        <p>Nombre:</p>
                        <Input
                            placeholder="Nombre"
                            value={selectedPos?.name ?? ""}
                            {...register('name')} 
                            onChange={(e)=>setSelectedPos({
                                name: e.target.value, 
                                description: selectedPos?.description ?? '',
                                id: selectedPos?.id ?? ''
                            })}
                            rounded={15}
                            background='white'
                            color='gray.600'
                            _hover={{ bg: "gray.100" }}
                        />
                        <p>Descripcion</p>
                        <Input
                            placeholder="Descripcion"
                            value={selectedPos?.description ?? ""}
                            {...register('descripcion')} 
                            onChange={(e)=>setSelectedPos({
                                description: e.target.value, 
                                name: selectedPos?.name ?? '',
                                id: selectedPos?.id ?? ''
                            })}
                            rounded={15}
                            background='white'
                            color='gray.600'
                            _hover={{ bg: "gray.100" }}
                        />
                    </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Flex>
                            <Button variant="ghost" onClick={onEditClose} mr={3}>
                                Cancelar
                            </Button>
                            <Button color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} mr={3} onClick={onEditConfirmOpen}>
                                Guardar
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isEditConfirmOpen} onClose={onEditConfirmClose} size="2xl" isCentered>
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
                <ModalContent>
                    <ModalHeader>Confirmar la Edicion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>¿Desea editar este cargo?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Flex>
                            <Button variant="ghost" onClick={onEditConfirmClose} mr={3}>
                                Cancelar
                            </Button>
                            <Button color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} mr={3} onClick={handleEditPosition}>
                                Guardar
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isDeleteConfirmOpen} onClose={onDeleteConfirmClose} size="2xl" isCentered>
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
                <ModalContent>
                    <ModalHeader>Confirmar el borrado</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>¿Desea borrar este cargo?</p>
                    </ModalBody>
                    <ModalFooter>
                        <Flex>
                            <Button variant="ghost" onClick={onDeleteConfirmClose} mr={3}>
                                Cancelar
                            </Button>
                            <Button color="white" bgColor='#AA546D' _hover={{ bgColor: "#c1738e" }} mr={3} onClick={handleDeleteClick}>
                                Borrar
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

type PaginationProps = {
    page: any,
    setPage: any
    total: number
}

const Pagination: React.FC<PaginationProps> = ({ page, setPage, total }) => {
    const handleLowerSelect = useCallback(() => {
        if (page > 1) {
            const newSelected = page - 1
            setPage(newSelected)
        }
    }, [page])

    const handleUpperSelect = useCallback(() => {
        if (page < total) {

            const newSelected = page + 1
            setPage(newSelected)
        }
    }, [page, total])

    const getClassNameBySelected = useCallback((page = false) => {
        if (page) return "w-[2.7%] flex text-center items-center justify-center aspect-square rounded-lg text-white bg-[#AA546D]"
        else return "cursor-pointer transition-all duration-300 w-[2.7%] flex text-center items-center justify-center aspect-square bg-[#F6F6F6] rounded-lg text-black hover:text-white hover:bg-[#AA546D]"
    }, [])

    return (
        <>
            <div className="flex justify-center gap-2 w-full  bottom-3 select-none mt-2 ">
                <button className={getClassNameBySelected(false)} onClick={() => { handleLowerSelect() }}> {"<"} </button>
                {total > 0 && Array.from({ length: total }, (_, i) => i + 1).map((p) => {
                    return <button key={p} className={getClassNameBySelected(page === p)} onClick={() => { setPage(p) }}>{p}</button>
                })}
                <button className={getClassNameBySelected(false)} onClick={() => { handleUpperSelect() }}> {">"} </button>
            </div>
        </>
    )
}