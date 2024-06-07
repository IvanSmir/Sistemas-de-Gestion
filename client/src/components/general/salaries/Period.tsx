import Period from '@/types/period';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { PayrollPeriod } from '@/types/payments';

interface PeriodProps {
    period: PayrollPeriod

}

export const PeriodCard: React.FC<PeriodProps> = ({ period }) => {
    const { periodStart, periodEnd } = period;
    const periodStartToString = new Date(periodStart).toLocaleDateString();
    const periodEndToString = periodEnd ? new Date(periodEnd).toLocaleDateString() : '';

    return (
        <Card w={"300px"} h={"250px"}  >
            <CardHeader>
                <Heading size='md'>{periodStartToString} - {periodEndToString}</Heading>

            </CardHeader>
            <CardBody>
                <Text>Estado: {period.isEnded ? 'Finalizado' : 'En proceso'}</Text>
            </CardBody>
            <CardFooter>
                <Link href={`/general/salaries/periods/${period.id}`}>
                    <Button>Ver Detalles</Button>
                </Link>
            </CardFooter>
        </Card>

    );
}