import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

interface PeriodProps {
    period: {
        periodStart: string,
        periodEnd: string,
        isEnded: boolean,
        totalAmount: number,
    };
}

export const PeriodCard: React.FC<PeriodProps> = ({ period }) => {
    return (
        <Card>
            <CardHeader>
                <Heading size='md'>{period.periodStart} - {period.periodStart}</Heading>
            </CardHeader>
            <CardBody>
                <Text>{period.totalAmount}</Text>
            </CardBody>
            <CardFooter>
                <Link href={`/general/salaries/id`}>
                    {period.isEnded ? (
                        <Button>Ver Detalles</Button>
                    ) : (
                        <Button>Generar Salario</Button>
                    )}

                </Link>
            </CardFooter>
        </Card>

    );
}