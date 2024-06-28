'use client'
import BarChart from "@/components/Home/Graphics/Bar/employees";
import PieChart from "@/components/Home/Graphics/Pie/Pie";
import { useAuth } from "@/components/context/AuthProvider";
import { PayrollPeriod } from "@/types/payments";
import PayrollDetail from "@/types/period";
import { getPayrollDetails, getPayrolls } from "@/utils/salary.http";
import { Flex, Heading, useToast } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getLastPayments, getLastTopEmployeesByIncome } from "@/utils/graphics.http";
import { DataPayments } from "@/types/graphics";
import { Employee } from "@/types/graphics";

export default function Home() {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const toast = useToast();
    const auth = useAuth();
    const [payments, setPayments] = useState<DataPayments>();
    const [loading, setLoading] = useState(false);
    const [lastTopEmployeesByIncome, setLastTopEmployeesByIncome] = useState<Employee[]>([]);
    const fetchLastTopEmployeesByIncome = useCallback(async () => {
        setLoading(true);
        try {
            toast.closeAll();
            toast({
                title: 'Cargando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });
            const { user } = auth;
            const token = user?.token || '';
            const data = await getLastTopEmployeesByIncome(token);
            console.log(data);
            toast.closeAll();
            toast({
                title: "Cargado",
                description: "Últimos pagos cargados con éxito",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setLastTopEmployeesByIncome(data);
        } catch (error) {
            console.error('Error al obtener los últimos pagos:', error);
            toast({
                title: "Error",
                description: "Error al obtener los últimos pagos",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }, [auth, toast]);
    const fetchLastPayments = useCallback(async () => {
        setLoading(true);
        try {
            toast.closeAll();
            toast({
                title: 'Cargando',
                description: 'Por favor espere...',
                status: 'loading',
                duration: null,
                isClosable: true,
            });
            const { user } = auth;
            const token = user?.token || '';
            const data = await getLastPayments(token);
            console.log(data);
            toast.closeAll();
            toast({
                title: "Cargado",
                description: "Últimos pagos cargados con éxito",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            setPayments(data[0]);
        } catch (error) {
            console.error('Error al obtener los últimos pagos:', error);
            toast({
                title: "Error",
                description: "Error al obtener los últimos pagos",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }, [auth, toast]);


    useEffect(() => {
        fetchLastPayments();
        fetchLastTopEmployeesByIncome();
    }, [fetchLastPayments, fetchLastTopEmployeesByIncome]);


    return (
        <>
            <Flex p={5} width={"100%"} h={"100vh"} m={"10vh"} flexDirection={"column"} justifyContent={"start    "} alignItems={"start"}>


                <div className="w-[100%] h- justify-evenly flex">

                    <div className="w-[50%] max-h-[60vh] rounded-lg p-6 bg-white shadow-xl">
                        <Heading mb={12} color={"gray.600"} fontSize={"3xl"}>Empleados de mayor salario</Heading>

                        <BarChart employees={lastTopEmployeesByIncome} />
                    </div>
                    <div className="w-[35%]  mb-10 max-h-[60vh] rounded-lg p-6 bg-white shadow-xl">
                        <Heading mb={4} color={"gray.600"} fontSize={"3xl"}>Ultimos pagos</Heading>
                        <div className="p-6">
                            <PieChart totalBonification={payments?.totalBonification || 0} totalIps={payments?.totalIps || 0} totalSalary={payments?.totalSalary || 0} totalIncome={payments?.totalIncome || 0} />

                        </div>
                    </div>

                </div>
            </Flex>
        </>
    );
}
