'use client'
import { TableContainer, Table, Tbody, Td, Th, Thead, Tr, Box, Flex, Button } from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react'
import Pagination from './Pagination'
import Link from 'next/link';
import VerifiedModal from '../general/salaries/VerifiedModal';
import Period from "@/types/period";
// Definimos los tipos para las props
type TableEmployeeProps = {
    data: { id: string;[key: string]: any }[]; // Cada dato tiene un ID y valores dinámicos
    columnMapping: { [header: string]: string }; // Mapeo de headers a claves de datos
    setEmployeeData?: any;
    total: number;
    isSalary?: boolean;
}

export const TableEmployee: React.FC<TableEmployeeProps> = ({ data, columnMapping, setEmployeeData, total, isSalary }) => {
    const [showDownload, setShowDownload] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [confirmOperation, setConfirmOperation] = useState(false);
    const [operation, setOperation] = useState("Generar");
    const [cierre, setCierre] = useState(false);
    const [verify, setVerify] = useState(false);
    const [isGenerar, setIsGenerar] = useState(false);
    const [isProcessClosed, setIsProcessClosed] = useState(false);
    const headers = Object.keys(columnMapping);
    const [filters, setFilters] = useState<{ ci: string; ageRange: string }>({
        ci: '',
        ageRange: '',
    });

    const handleCiFilter = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, ci: e.target.value });
    };



    const handleOperation = (operationType: string) => {
        setConfirmOperation(false);
        setOperation(operationType);
        setShowModal(true);
    };

    const handleConfirm = () => {
        if (operation === "Cierre") {
            setIsProcessClosed(true);
        }
    };

    return (
        <Box marginTop={6} width={{ base: "100%", sm: "90%", md: "80%", lg: "100%", xl: "100%", "2xl": "100%" }} >
            <Flex justifyContent="end" mb={6} flexWrap="wrap">

                {!isSalary ? (
                    <>
                        <Link href="/employees/add">
                            <Button
                                rounded={23}
                                mr={5}
                                fontSize={{ base: 11, sm: 12, md: 13, lg: 14, xl: 15, "2xl": 16 }}
                                py={{ base: 3, sm: 3.5, md: 4, lg: 4.5, xl: 5, "2xl": 5.5 }}
                                px={{ base: 6, sm: 6.5, md: 7, lg: 7.5, xl: 8, "2xl": 8.5 }}
                                bgColor="#AA546D"
                                _hover={{ bgColor: "#c1738e" }}
                                gap={2}
                                color="white"
                                mt={{ base: "10px", md: "0" }}
                            >
                                Agregar Funcionario
                            </Button>
                        </Link>
                    </>
                ) : isProcessClosed ? (
                    <Box mt={4} width={'w-full'} color={'gray.600'} fontSize={{ base: 18, sm: 20, md: 22, lg: 24, xl: 26, "2xl": 28 }} fontWeight="bold">
                        Pago de Salarios Cerrado
                    </Box>
                ) : (
                    <>
                        <VerifiedModal
                            isOpen={showModal}
                            onClose={() => setShowModal(false)}
                            onConfirm={() => {
                                setShowModal(false);
                                handleConfirm();
                            }}
                            operation={operation}
                            areVerified={verify}
                            confirmOperation={confirmOperation}
                            setConfirmOperation={setConfirmOperation}
                            showDownload={showDownload}
                            setIsGenerar={setIsGenerar}
                            setCierre={setCierre}
                        />

                        {/* Botón Más Importante */}
                        <Button
                            rounded={23}
                            mr={5}
                            fontSize={{ base: 14, sm: 15, md: 16, lg: 17, xl: 18, "2xl": 19 }}
                            py={{ base: 3, sm: 3.5, md: 4, lg: 4.5, xl: 5, "2xl": 5.5 }}
                            px={{ base: 12, sm: 12.5, md: 13, lg: 13.5, xl: 14, "2xl": 14.5 }}
                            bgColor="rgb(170, 84, 109)"
                            _hover={{ bgColor: "rgb(239, 167, 177)" }}
                            gap={2}
                            color="white"
                            mt={{ base: "10px", md: "0" }}
                            onClick={() => handleOperation("Generar")}
                        >
                            Generar Salario
                        </Button>

                        {cierre && (
                            /* Botón Importante */
                            <Button
                                rounded={23}
                                mr={5}
                                fontSize={{ base: 14, sm: 15, md: 16, lg: 17, xl: 18, "2xl": 19 }}
                                py={{ base: 3, sm: 3.5, md: 4, lg: 4.5, xl: 5, "2xl": 5.5 }}
                                px={{ base: 12, sm: 12.5, md: 13, lg: 13.5, xl: 14, "2xl": 14.5 }}
                                bgColor=" rgb(220, 70, 90)"
                                _hover={{ bgColor: " rgb(170, 84, 109)", color: "white" }}
                                borderColor="rgb(170, 84, 109)"
                                borderWidth="2px"
                                gap={2}
                                color="white"
                                mt={{ base: "10px", md: "0" }}
                                onClick={() => handleOperation("Cierre")}
                            >
                                Cierre
                            </Button>
                        )}

                        {/* Botón Secundario */}
                        <Button
                            rounded={23}
                            mr={5}
                            fontSize={{ base: 14, sm: 15, md: 16, lg: 17, xl: 18, "2xl": 19 }}
                            py={{ base: 3, sm: 3.5, md: 4, lg: 4.5, xl: 5, "2xl": 5.5 }}
                            px={{ base: 12, sm: 12.5, md: 13, lg: 13.5, xl: 14, "2xl": 14.5 }}
                            bgColor="rgb(245, 245, 245)"
                            _hover={{ bgColor: "rgb(239, 167, 177)", color: "white" }}
                            borderColor="rgb(170, 84, 109)"
                            borderWidth="2px"
                            gap={2}
                            color="rgb(170, 84, 109)"
                            mt={{ base: "10px", md: "0" }}
                            onClick={() => handleOperation("bonificaciones")}
                        >
                            Asignar Bonificaciones
                        </Button>

                        {/* Botón Secundario Alternativo */}
                        <Button
                            rounded={23}
                            mr={5}
                            fontSize={{ base: 14, sm: 15, md: 16, lg: 17, xl: 18, "2xl": 19 }}
                            py={{ base: 3, sm: 3.5, md: 4, lg: 4.5, xl: 5, "2xl": 5.5 }}
                            px={{ base: 12, sm: 12.5, md: 13, lg: 13.5, xl: 14, "2xl": 14.5 }}
                            bgColor="rgb(255, 255, 255)"
                            _hover={{ bgColor: "rgb(239, 167, 177)", color: "white" }}
                            borderColor="rgb(170, 84, 109)"
                            borderWidth="2px"
                            gap={2}
                            color="rgb(170, 84, 109)"
                            mt={{ base: "10px", md: "0" }}
                            onClick={() => handleOperation("IPS")}
                        >
                            Asignar IPS
                        </Button>
                    </>




                )}

            </Flex>
            <Box backgroundColor="white" borderRadius="2xl" padding="8px">

                <TableContainer>
                    <Table variant="simple" fontSize={{ base: "12px", sm: "13px", md: "14px", lg: "15px", xl: "16px", "2xl": "17px" }}>
                        <Thead>
                            <Tr>
                                {headers.map((header, index) => (
                                    <Th key={index} textAlign="center" verticalAlign="middle">
                                        {header}
                                    </Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map((datum) => (
                                <Tr key={datum.id}>
                                    {headers.map((header) => (
                                        <Td key={`${datum.id}-${header}`} textAlign="center" verticalAlign="middle">
                                            {datum.person[columnMapping[header]]}
                                        </Td>
                                    ))}

                                    <Td textAlign="center" verticalAlign="middle">
                                        {isSalary ? (
                                            <>
                                                {isGenerar && (
                                                    <Button
                                                        fontSize={{ base: 11, sm: 12, md: 13, lg: 14, xl: 15, "2xl": 16 }}
                                                        py={{ base: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4, "2xl": 4.5 }}
                                                        px={{ base: 4, sm: 4.5, md: 5, lg: 5.5, xl: 6, "2xl": 6.5 }}
                                                        _hover={{ bgColor: "red.500" }} bg="red.400" color={"white"}>Descargar</Button>
                                                )}
                                            </>
                                        ) : (
                                            <Link className='text-blue-500' href={`/employees/${datum.id}`}>
                                                Detalles
                                            </Link>
                                        )}
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
            <Pagination setEmployeedata={setEmployeeData} total={total} />
        </Box >
    );
}
