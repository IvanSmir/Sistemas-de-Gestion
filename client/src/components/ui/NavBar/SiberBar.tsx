'use client'
import React, { useState } from 'react';
import {
    Flex,
    Text,
    IconButton,
    Divider,
    Avatar,
    Heading
} from '@chakra-ui/react';
import {
    FiMenu,
    FiHome,
    FiCalendar,
    FiUser,
    FiDollarSign,
    FiBriefcase,
    FiSettings
} from 'react-icons/fi';

export const SiberBar = () => {
    const [navSize, ChangeNavSize] = useState('large');

    return (
        <Flex
            pos="sticky"
            left="5"
            h="95vh"
            marginTop="2.5vh"
            backgroundColor="#AA546D" // Cambio a backgroundColor
            boxShadow="0 4px 12px 0 rgba(0,0,0,0.05)"
            w={navSize === "small" ? "75px" : "200px"}
            flexDir="column"
            justifyContent="space-between" // Cambio a space-between
        >
            <Flex
                p="5%"
                flexDir="column"
                alignItems={navSize == "small" ? "none": "Flex-start"}
                as="nav"
            >
                <IconButton
                    background="none"
                    mt={5}
                    _hover={{ background: 'none' }}
                    icon={<FiMenu />}
                    onClick={() => {
                        if (navSize === "small")
                            ChangeNavSize("large");
                        else
                            ChangeNavSize("small");
                    }}
                    aria-label="Toggle menu" // Descripción para accesibilidad
                />
            </Flex>

            <Flex
                p="5%"
                flexDir="column"
                w="100%"
                alignItems= {navSize == "small" ? "none": "Flex-start"}
                mb={4}
            >
                <Divider display = {navSize == "small" ? "none": "Flex-start"} />
                <Flex mt={4} align="center">
                    <Avatar size="sm" src="avatar-1.jpg" />
                    <Flex flexDir="column" ml={4}  display = {navSize == "samll" ? "none": "Flex-start"}>
                        <Heading as="h3" size="sm">Juan Perez</Heading>
                        <Text color="gray">Admin</Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};
