'use client'
import { Box, BoxProps, Flex, useColorModeValue, Text, CloseButton } from "@chakra-ui/react";
import { NavItem } from "./NavItem";
import { IconType } from "react-icons";
import { FiCompass, FiHome, FiSettings, FiStar, FiTrendingUp, FiUsers } from "react-icons/fi";

interface LinkItemProps {
    name: string;
    icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Inicio', icon: FiHome },
    { name: 'Funcionarios', icon: FiUsers },
    { name: 'Cargos', icon: FiCompass },
    { name: 'Settings', icon: FiSettings },
];
interface SidebarProps extends BoxProps {
    onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('#AA546D', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="Source Sans 3" fontWeight="bold" color="white">
                    La Ferreteria
                </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem color="white" key={link.name} icon={link.icon} href={link.name === 'Funcionarios' ? '/funcionarios' : '#'}>
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};