'use client'
import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    Flex,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { getEmployeeDetails, deletePositionDetail } from '@/utils/detail.http';
import { useParams } from "next/navigation";
import { useAuth } from "@/components/context/AuthProvider";
import { AddPositionInDetails } from "./addPositionInDetails";
import { EditPositionInDetails } from "./EditPositionDetails";
interface Position {
    name: string;
}

interface EmployeeDetailsProps {
    id: string;
    name: string;
}
interface EmployeeDetails {
    id: string;
    position: Position;
    startDate: string;
    endDate: string;
    salaryType: string;
    salary: number;
}

export const EmployeeDetailsList: React.FC = () => {
    const [employeeDetails, setEmployeeDetails] = useState<EmployeeDetails[]>([]);
    const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<EmployeeDetails | null>(null);
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
    const { id } = useParams();
    const auth = useAuth();
    const toast = useToast();
    console.log("ID:", id);

    const fetchEmployeesDetails = useCallback(async () => {
        try {
            const { user } = auth;
            const token = user?.token || '';
            const data: EmployeeDetails[] = await getEmployeeDetails(id as string, token) as EmployeeDetails[];
            setEmployeeDetails(data);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    }, [id, auth]);

    useEffect(() => {
        fetchEmployeesDetails().catch(error => {
            toast({
                title: "Error",
                description: "Error al obtener los detalles del empleado",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        });
    }, [fetchEmployeesDetails]);

    const handleEditClick = (employee: EmployeeDetails, event: React.MouseEvent) => {
        event.stopPropagation();
        setSelectedEmployeeDetails(employee);
        onEditOpen();
    };

    const handleDeleteClick = async (id: string, event: React.MouseEvent) => {
        const { user } = auth;
        const token = user?.token || '';
        console.log("Token usado para eliminar:", token);
        event.stopPropagation();
        if (confirm("¿Desea borrar este registro de cargo?")) {
            if (user?.token) {
                try {
                    await deletePositionDetail(id, token);
                    toast({
                        title: "Eliminado con éxito",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                    setEmployeeDetails(employeeDetails.filter(employeeDetail => employeeDetail.id !== id));
                    fetchEmployeesDetails();
                } catch (error) {
                    toast({
                        title: "No se ha logrado la eliminación",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            }
        }
    };

    const getStatus = (startDate: string, endDate: string) => {
        const currentDate = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        return currentDate >= start && currentDate <= end ? "Activo" : "Inactivo";
    };

    return (
        <Box backgroundColor={'white'} borderRadius="2xl" padding="8px" >
            <Flex justifyContent="end" mb={6} >
                <Button onClick={onAddOpen} rounded={23} mr={5} fontSize={13} py={3} px={5} bgColor='gray.700' _hover={{ bgColor: "gray.800" }} gap={2} color='white'>
                    <AddIcon />Agregar Cargo
                </Button>
            </Flex>
            <TableContainer>
                <Table variant="simple" fontSize="14px">
                    <Thead>
                        <Tr>
                            <Th>Posición</Th>
                            <Th>Fecha de Inicio</Th>
                            <Th>Fecha de Fin</Th>
                            <Th>Tipo de Salario</Th>
                            <Th>Salario</Th>
                            <Th>Estado</Th>
                            <Th>Acciones</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {employeeDetails.map((employeeDetail, index) => (
                            <Tr key={index}>
                                <Td>{employeeDetail.position.name}</Td>
                                <Td>{new Date(employeeDetail.startDate).toLocaleDateString()}</Td>
                                <Td>{new Date(employeeDetail.endDate).toLocaleDateString()}</Td>
                                <Td>{employeeDetail.salaryType === 'minimum' ? 'Mínimo' : 'Base'}</Td>
                                <Td>{employeeDetail.salary}</Td>
                                <Td>{getStatus(employeeDetail.startDate, employeeDetail.endDate)}</Td>
                                <Td>
                                    <EditIcon
                                        mr={2}
                                        cursor="pointer"
                                        onClick={(event) => handleEditClick(employeeDetail, event)}
                                    />
                                    <DeleteIcon
                                        cursor="pointer"
                                        onClick={(event) => handleDeleteClick(employeeDetail.id, event)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <AddPositionInDetails isOpen={isAddOpen} onClose={onAddClose} fetchData={fetchEmployeesDetails} types={[]} />
            {selectedEmployeeDetails && (
                <EditPositionInDetails
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    fetchData={fetchEmployeesDetails}
                    positionId={selectedEmployeeDetails.id}
                />
            )}
        </Box>
    );
};
