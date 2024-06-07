import React from 'react';
import { Flex, Button, Text } from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

const PaginationSalaries: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    // Crear un array de páginas para renderizar los botones de paginación
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <Flex >
            <Button
                size={'sm'}
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                m={1}
            >
                <ArrowLeftIcon />
            </Button>
            <Button
                size={'sm'}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                m={1}
            >
                <Text as={"b"}>{"<"}</Text>
            </Button>
            {pages.map(page => (
                <Button
                    size={'sm'}

                    key={page}
                    onClick={() => onPageChange(page)}
                    colorScheme={page === currentPage ? 'pink' : 'gray'}
                    variant={page === currentPage ? 'solid' : 'outline'}
                    m={1}
                >
                    {page}
                </Button>
            ))}
            <Button
                size={'sm'}

                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                m={1}
            >
                <Text as={"b"}>{">"}</Text>
            </Button>
            <Button
                size={'sm'}
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                m={1}
            >
                <ArrowRightIcon />
            </Button>
        </Flex>
    );
};

export default PaginationSalaries;
