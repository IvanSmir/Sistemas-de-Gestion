import { Flex, Heading } from "@chakra-ui/react";

export default function Home() {
    return (
        <>
            <Flex width={"100%"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                <Heading color={"pink.200"} fontSize={"5xl"}>Bienvendio a LA Ferreteria</Heading>
            </Flex >
        </>
    );
}
