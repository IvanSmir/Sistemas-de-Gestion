'use client'
import { Flex, FlexProps, Icon, Link } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { usePathname } from 'next/navigation';

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: React.ReactNode;
    href: string;
}

export const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
    const pathname = usePathname();

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (pathname === href) {
            event.preventDefault();
        } else if (href === '/') {
            event.preventDefault();
            window.location.href = '/';
        }
    };

    return (
        <Link href={href} onClick={handleClick} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: '#D18F9D',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};
