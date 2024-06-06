'use client'
import { Period } from '@/components/general/salaries/Period';
import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, SimpleGrid, Box, Heading, Card, CardBody, IconButton } from '@chakra-ui/react';
import React, { useState } from 'react';

interface PeriodType {
    date: string;
    name: string;
    description: string;
    completed: boolean;
}

const PeriodPage = () => {
    const [periods, setPeriods] = useState<PeriodType[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const addPeriod = () => {
        if (periods.length > 0 && !periods[periods.length - 1].completed) {
            // Si el último periodo no está completo, no agregar un nuevo periodo
            return;
        }

        const currentYear = new Date().getFullYear();
        const newPeriodIndex = periods.length;
        const monthIndex = newPeriodIndex % 12;
        const yearOffset = Math.floor(newPeriodIndex / 12);
        const newYear = currentYear + yearOffset;

        if (!years.includes(newYear)) {
            setYears([...years, newYear]);
        }

        const newDate = months[monthIndex];
        const newPeriod: PeriodType = {
            date: newDate,
            name: `${newDate}`,
            description: `Descripción del periodo ${newDate}`,
            completed: false,
        };
        setPeriods([...periods, newPeriod]);
    };

    return (
        <>
            <Flex bg={'white'} w={"100%"} h={"h-full"} direction={"column"} justifyContent={"start"} >
                {years.length === 0 && (
                    <SimpleGrid mt={4} w={"100%"} spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>


                        <Card h={"30vh"} _hover={{ bg: 'gray.50' }} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                            <CardBody
                                width={"100%"} height={"h-full"} p={4} display="flex" justifyContent="center" alignItems="center">
                                <IconButton
                                    border={"1px solid #c2c2c2"}
                                    borderRadius="md"
                                    bgColor={"white"}
                                    onClick={addPeriod}
                                    icon={<AddIcon boxSize={8} />}
                                    aria-label='Agregar periodo'
                                    width={"100%"}
                                    height={"100%"}
                                    _hover={{ bg: 'transparent' }}
                                />
                            </CardBody>
                        </Card>
                    </SimpleGrid>
                )}
                {years.map((year) => (
                    <Box key={year} p={4}>
                        <Heading as="h2" size="lg" mt={6} mb={4}>Periodo {year}</Heading>
                        <SimpleGrid w={"100%"} spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                            {periods
                                .filter((_, index) => Math.floor(index / 12) === year - (new Date().getFullYear()))
                                .map((period, index) => (
                                    <Period key={`${year}-${index}`} period={period} />
                                ))}
                            <Card h={"30vh"} _hover={{ bg: 'gray.50' }} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <CardBody
                                    width={"100%"} height={"h-full"} p={4} display="flex" justifyContent="center" alignItems="center">
                                    <IconButton
                                        border={"1px solid #c2c2c2"}
                                        borderRadius="md"
                                        bgColor={"white"}
                                        onClick={addPeriod}
                                        icon={<AddIcon boxSize={8} />}
                                        aria-label='Agregar periodo'
                                        width={"100%"}
                                        height={"100%"}
                                        _hover={{ bg: 'transparent' }}
                                    />
                                </CardBody>
                            </Card>
                        </SimpleGrid>
                    </Box>
                ))}
            </Flex>
        </>
    );
};

export default PeriodPage;
