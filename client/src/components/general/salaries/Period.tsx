import { Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

interface PeriodProps {
    period: {
        name: string;
        description: string;
        completed: boolean;
    };


}

export const Period: React.FC<PeriodProps> = ({ period }) => {
    return (
        <Card>
            <CardHeader>
                <Heading size='md'>{period.name}</Heading>
            </CardHeader>
            <CardBody>
                <Text>{period.description}</Text>
            </CardBody>
            <CardFooter>
                <Link href={`/general/salaries/periods`}>
                    {period.completed ? (
                        <Button>Ver Detalles</Button>
                    ) : (
                        <Button>Generar Salario</Button>
                    )}

                </Link>
            </CardFooter>
        </Card>

    );
}