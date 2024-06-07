import {
    Box,
    BoxProps,
    Flex,
    useColorModeValue,
    Text,
    CloseButton,
    VStack,
    Collapse,
    IconButton
} from "@chakra-ui/react";
import { NavItem } from "./NavItem";
import { useState } from "react";
import { IconType } from "react-icons";
import { FiChevronDown, FiCompass, FiHome, FiSettings, FiUsers } from "react-icons/fi";
import { GrTransaction } from "react-icons/gr";

interface LinkItemProps {
    name: string;
    icon: IconType;
    href: string;
    subItems?: Array<LinkItemProps>;
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Inicio', icon: FiHome, href: '/' },
    { name: 'Funcionarios', icon: FiUsers, href: '/employees' },
    { name: 'Cargos', icon: FiCompass, href: '/general/positions' },
    {
        name: 'Movimientos', icon: GrTransaction, href: '#', subItems: [
            { name: 'Ingresos', icon: GrTransaction, href: '/transaction/incomes' },
            { name: 'Egresos', icon: GrTransaction, href: '/transaction/expenses' },
            {
                name: 'Tipos de movimientos', icon: GrTransaction, href: '#', subItems: [
                    { name: 'Ingresos', icon: GrTransaction, href: '/general/incomeType/' },
                    { name: 'Egresos', icon: GrTransaction, href: '/general/expenseType' }
                ]
            }
        ]
    },
    { name: 'Settings', icon: FiSettings, href: '/ConfigBasic' },
];

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    const [isMovementsOpen, setIsMovementsOpen] = useState(false);
    const [isTransactionTypeOpen, setIsTransactionTypeOpen] = useState(false);

    const handleMovementsClick = () => {
        setIsMovementsOpen(!isMovementsOpen);
    };

    const handleTransactionTypeClick = () => {
        setIsTransactionTypeOpen(!isTransactionTypeOpen);
    };

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
                <Box key={link.name}>
                    <Flex align="center">
                        <NavItem
                            color="white"
                            icon={link.icon}
                            href={link.href}
                            onClick={
                                link.name === 'Movimientos'
                                    ? handleMovementsClick
                                    : link.name === 'Tipos de movimientos'
                                    ? handleTransactionTypeClick
                                    : undefined
                            }
                            flex="1"
                        >
                            {link.name}
                        </NavItem>
                        {(link.name === 'Movimientos' || link.name === 'Tipos de movimientos') && (
                            <IconButton
                                aria-label={`Expand ${link.name}`}
                                icon={<FiChevronDown />}
                                size="sm"
                                onClick={
                                    link.name === 'Movimientos'
                                        ? handleMovementsClick
                                        : handleTransactionTypeClick
                                }
                                variant="ghost"
                                color="white"
                            />
                        )}
                    </Flex>
                    {link.subItems && (
                        <Collapse in={link.name === 'Movimientos' ? isMovementsOpen : isTransactionTypeOpen}>
                            <VStack pl="8" align="start">
                                {link.subItems.map((subItem) => (
                                    <Box key={subItem.name}>
                                        <Flex align="center">
                                            <NavItem
                                                color="white"
                                                icon={subItem.icon}
                                                href={subItem.href}
                                                onClick={
                                                    subItem.name === 'Tipos de movimientos'
                                                        ? handleTransactionTypeClick
                                                        : undefined
                                                }
                                                flex="1"
                                            >
                                                {subItem.name}
                                            </NavItem>
                                            {subItem.subItems && (
                                                <IconButton ml="15"
                                                    aria-label={`Expand ${subItem.name}`}
                                                    icon={<FiChevronDown />}
                                                    size="sm"
                                                    onClick={handleTransactionTypeClick}
                                                    variant="ghost"
                                                    color="white"
                                                />
                                            )}
                                        </Flex>
                                        {subItem.subItems && (
                                            <Collapse in={isTransactionTypeOpen}>
                                                <VStack pl="8" align="start">
                                                    {subItem.subItems.map((nestedSubItem) => (
                                                        <NavItem color="white" key={nestedSubItem.name} icon={nestedSubItem.icon} href={nestedSubItem.href}>
                                                            {nestedSubItem.name}
                                                        </NavItem>
                                                    ))}
                                                </VStack>
                                            </Collapse>
                                        )}
                                    </Box>
                                ))}
                            </VStack>
                        </Collapse>
                    )}
                </Box>
            ))}
        </Box>
    );
};




