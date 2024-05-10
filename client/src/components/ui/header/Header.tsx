'use client'
import React from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  Button,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Box w="100%" bg={useColorModeValue('gray.100', 'gray.900')} px={10}>
        <Flex h={100}  alignItems={'center'} justifyContent={'space-between'}>
          <Box>
            <Text fontSize='3xl'></Text>
          </Box>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button >
              <Flex alignItems={'center'}>
                <Avatar
                    src={'https://avatars.dicebear.com/api/male/username.svg'}
                  />
                  <Text ml={2}>Juan Perez</Text>
              </Flex>
              
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}