'use client'
import { PeriodCard } from '@/components/general/salaries/Period';
import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, SimpleGrid, Box, Heading, Card, CardBody, IconButton, useToast, Tooltip } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { PayrollPeriod } from '@/types/payments';
import { getPayrolls, createPayroll, createPayments } from '@/utils/salary.http';
import { useAuth } from '@/components/context/AuthProvider';
import { useRouter } from 'next/navigation';

const PeriodPage = () => {
    const router = useRouter();
    const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
    const auth = useAuth();
    const toast = useToast();
    const [activePeriod, setActivePeriod] = useState<Boolean>(false);

    const createPayrolls = async () => {
        if (activePeriod) {
            return;
        }
        try {
            const { user } = auth;
            const token = user?.token || '';
            const data = await createPayroll(token);
            console.log("data22222", data);
            fetchPayrolls();
        }

        catch (error) {
            console.error('Error al generar salario:', error);
            toast({
                title: "Error",
                description: "Error al generar el salario",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }

    const fetchPayrolls = useCallback(async () => {
        try {
            const { user } = auth;
            const token = user?.token || '';
            const data: PayrollPeriod[] = await getPayrolls(token) as PayrollPeriod[];
            console.log(data);
            setPeriods(data);
        } catch (error) {
            console.error('Error fetching employee data:', error);
            toast({
                title: "Error",
                description: "Error al obtener la lista de periodos",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, [auth, toast]);

    useEffect(() => {
        fetchPayrolls();
    }, [fetchPayrolls]);

    useEffect(() => {
        if (periods.length > 0) {
            if (periods[0].isEnded) {
                setActivePeriod(false);
            } else {
                setActivePeriod(true);
            }
        } else {
            setActivePeriod(false);
        }
    }, [periods]);

    return (
        <Flex width={"90%"} flexDirection={"column"}>
            <Heading color={"gray.600"} mt={4} marginLeft={5} width={"100%"}>Periodos</Heading>

            <Box marginTop={6} width={{ base: "100%", sm: "90%", md: "80%", lg: "100%", xl: "100%", "2xl": "100%" }} height={"70vh"}>


                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
                    <Card w={"300px"} h={"250px"} _hover={{ bg: 'gray.50' }} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                        <CardBody
                            width={"100%"} height={"100%"} p={4} display="flex" justifyContent="center" alignItems="center">
                            <Tooltip label="Ya existe un periodo activo" isDisabled={!activePeriod} hasArrow arrowSize={15}>
                                <IconButton
                                    border={"1px solid #c2c2c2"}
                                    borderRadius="md"
                                    bgColor={!activePeriod ? "white" : "gray.100"}
                                    onClick={createPayrolls}
                                    icon={<AddIcon boxSize={8} />}
                                    aria-label='Agregar periodo'
                                    width={"100%"}
                                    height={"100%"}
                                    _hover={{ bg: !activePeriod ? 'transparent' : 'gray.100', cursor: activePeriod ? 'not-allowed' : 'pointer' }}
                                />
                            </Tooltip>
                        </CardBody>
                    </Card>
                    {periods.map((period) => (
                        <PeriodCard
                            key={period.id}
                            period={period}
                        />
                    ))}
                </SimpleGrid>
            </Box>
        </Flex>


    );
};

export default PeriodPage;
