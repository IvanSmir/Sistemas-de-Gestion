'use client'
import { PeriodCard } from '@/components/general/salaries/Period';
import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, SimpleGrid, Box, Heading, Card, CardBody, IconButton, useToast } from '@chakra-ui/react';
import React, { use, useCallback, useEffect, useState } from 'react';
import Period from '@/types/period';
import { getPayrolls, createPayroll } from '@/utils/salary.http';

import { useAuth } from '@/components/context/AuthProvider';

const PeriodPage = () => {
    const [periods, setPeriods] = useState<Period[]>([]);
    const auth = useAuth();
    const toast = useToast();
    const createPeriod = async () => {
        try {
            const { user } = auth;
            const token = user?.token || '';
            const data = await createPayroll(token);
            console.log(data);
        } catch (error) {
            console.error('Error adding period:', error);
            toast({
                title: "Error",
                description: "Error al agregar el periodo",
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
            const data: Period[] = await getPayrolls(token) as Period[];
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
        fetchPayrolls()
    }, [fetchPayrolls]);
    return (
        <>



            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
                <Card w={"300px"} h={"250px"} _hover={{ bg: 'gray.50' }} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                    <CardBody
                        width={"100%"} height={"100%"} p={4} display="flex" justifyContent="center" alignItems="center">
                        <IconButton
                            border={"1px solid #c2c2c2"}
                            borderRadius="md"
                            bgColor={"white"}
                            onClick={createPeriod}
                            icon={<AddIcon boxSize={8} />}
                            aria-label='Agregar periodo'
                            width={"100%"}
                            height={"100%"}
                            _hover={{ bg: 'transparent' }}
                        />
                    </CardBody>
                </Card>
                {periods.map((period) => (
                    <PeriodCard
                        key={period.id}
                        period={period}
                    />
                ))}
            </SimpleGrid>

        </>
    );
};

export default PeriodPage;
