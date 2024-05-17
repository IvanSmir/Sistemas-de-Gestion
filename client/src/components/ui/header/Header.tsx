'use client'
import { Box, Drawer, DrawerContent, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { ReactNode } from "react";
import { MobileNav } from "@/components/ui/navbar/MobilNav";
import { SidebarContent } from "@/components/ui/navbar/Sidebar";

export function SidebarWithHeader({
    children,
}: {
    children: ReactNode;
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full">
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box
                ml={{ base: 0, md: 60 }}
                mt={{ base: 20, md: 0 }}
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="calc(100vh - 84px)" // Ajusta la altura mínima para centrar el contenido
            >
                {children}
            </Box>
        </Box>
    );
}
