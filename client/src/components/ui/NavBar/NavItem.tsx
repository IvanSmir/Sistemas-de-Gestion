'use client'
import React from 'react'
import {
  Flex,
  Text,
  Icon,
  Link,
  Menu,
  MenuButton,
  MenuList
} from '@chakra-ui/react'
interface NavItemProps {
  navSize: string; 
  icon: React.ElementType;
  title: string;
  active: boolean;
  onClick?: (title: string) => void; 
}

export const NavItem = ({navSize, icon, title, active}: NavItemProps) =>{
  
  return(
    <Flex
      mt={30}
      flexDir="column"
      w="100%"
      alignItems={navSize == "small" ? "center" : "flex-start"}
    >
      <Menu placement='right'>
        <Link
        backgroundColor={active ? "#D18F9D" : "transparent"} 
        p={3}
        borderRadius={8}
        color="#FFFFFF"
        fontFamily="Source Sans 3"
        _hover={{textDecor: 'none', backgroundColor: '#D18F9D'}}
        w={navSize == "large" ? "100%" : "auto"} 
        >
        <MenuButton w="100%">
            <Flex>
              <Icon as={icon} font size="xl" color={active ? "white" : "white"}/>
              <Text ml={5}  display={navSize == "small" ? "none" : "flex"}>{title}</Text>
            </Flex>
        </MenuButton>
        </Link>
      </Menu>
    </Flex>
  )
}