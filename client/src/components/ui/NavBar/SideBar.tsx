'use client'
import React, { useState } from 'react';
import {
    Flex,
    Text,
    IconButton,
    Link,
    Divider,
    Avatar,
    Heading
} from '@chakra-ui/react';
import {
    FiMenu,
    FiHome,
    FiAtSign,
    FiCalendar,
    FiUsers,
    FiDollarSign,
    FiBriefcase,
    FiSettings
} from 'react-icons/fi';
import { CiLogout, CiCircleQuestion } from "react-icons/ci";
import { NavItem } from './NavItem';

import { useRouter } from 'next/navigation'
interface NavItemProps {
    navSize: string;
    icon: React.ElementType;
    title: string;
    active: boolean;
    onClick?: (title: string) => void; 
}
export const SideBar = () => {
    const [navSize, ChangeNavSize] = useState('large');
    const [activeItem, setAtiveItem] = useState('');
    
    const router = useRouter();

    const handleItemClick=(title: React.SetStateAction<string>)=>{
        setAtiveItem(title);
    }

    return (
        <Flex
            pos="sticky"
            backgroundColor="#AA546D" // Cambio a backgroundColor
            boxShadow="0 4px 12px 0 rgba(0,0,0,0.05)"
            w={navSize === "small" ? "75px" : "300px"}
            h="100%"
            flexDir="column"
            justifyContent="space-between" // Cambio a space-between
        >
            <Flex
                p="5%"
                flexDir="column"
                alignItems="center"
                as="nav"
            >
                <Flex alignItems="center" color="#FFFFFF" fontSize="xl" mb={2}>
                <IconButton
                    
                    background="none"
                    mt={5}
                    color="#FFFFFF"
                    _hover={{ background: 'none' }}
                    icon={<FiAtSign fontSize="2xl"/>}
                    onClick={() => {
                        if (navSize === "small")
                            ChangeNavSize("large");
                        else
                            ChangeNavSize("small");
                    }}
                    aria-label="Toggle menu"
                />
                {navSize === "large" && (<Text ml={2} fontWeight="bold" fontSize="2xl">Ferreteria </Text>)}
                </Flex >
                <Flex flexDir="column" alignItems="center" w="100%">
                    <Link href='/'>
                        <NavItem navSize={navSize} icon={FiHome} title="Inicio " active={activeItem === 'Inicio'} onClick={handleItemClick} />
                    </Link>
                    <Link href='/funcionarios'>
                      <NavItem navSize={navSize} icon={FiUsers} title="Funcionarios" active={activeItem === 'FUncionarios'} onClick={handleItemClick}/>
                    </Link>
                  
                </Flex>

            </Flex>

            <Flex
                p="5%"
                flexDir="column"
                w="100%"
                alignItems="center"
                mb={4}
            >
                <Flex mt={4} align="center"  flexDir="column">
                <NavItem navSize={navSize} icon={CiCircleQuestion } title="Help" active={false}/>
                <NavItem navSize={navSize} icon={CiLogout} title="Log Out" active={false}/>
                </Flex>
            </Flex>
        </Flex>
    );
};