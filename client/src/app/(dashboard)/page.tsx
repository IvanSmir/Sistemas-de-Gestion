'use client'
import BarChart from "@/components/Home/Graphics/Bar/employees";
import PieChart from "@/components/Home/Graphics/Pie/Pie";
import { useAuth } from "@/components/context/AuthProvider";
import { Employee } from "@/types/period/employee";
import { PayrollPeriod } from "@/types/payments";
import PayrollDetail from "@/types/period";
import { getPayrollDetails, getPayrolls } from "@/utils/salary.http";
import { Flex, Heading, useToast } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";


interface DataPayments {
    ips: number;
    salary: number;
    otherIncomes: number;
    bonus: number;

}

export default function Home() {


    const toast = useToast();
    const { periodsId } = useParams();
    const auth = useAuth();
    const [dataPayments, setDataPayments] = useState<DataPayments>({
        ips: 50000,
        salary: 2000,
        otherIncomes: 300,
        bonus: 40,
    })
    const [employees, setEmployees] = useState<Employee[]>([
        {
            name: "Rodrigo",
            amount: 100,
        },
        {
            name: "Juan",
            amount: 200,
        },
        {
            name: "Maria",
            amount: 300,
        },
    ]);

    const [loading, setLoading] = useState(false);

    const [periods, setPeriods] = useState<PayrollPeriod[]>([]);


    // const fetchPayrolls = useCallback(async () => {
    //     try {
    //         const { user } = auth;
    //         const token = user?.token || '';
    //         const data: PayrollPeriod[] = await getPayrolls(token) as PayrollPeriod[];

    //         console.log(data);
    //         setPeriods(data);


    //         const lastPeriod = data[0];
    //         const detail = await getPayrollDetails(lastPeriod.id, token);
    //         setPayments(detail);
    //         console.log("data33333", detail.payrollDetails);

    //     } catch (error) {
    //         console.error('Error fetching employee data:', error);
    //         toast({
    //             title: "Error",
    //             description: "Error al obtener la lista de periodos",
    //             status: "error",
    //             duration: 3000,
    //             isClosable: true,
    //         });
    //     }
    // }, [auth, toast]);


    // useEffect(() => {
    //     fetchPayrolls();
    // }, [fetchPayrolls]);

    return (
        <>
            <Flex backgroundColor={"gray.100"} p={5} width={"100%"} h={"100vh"} flexDirection={"column"} justifyContent={"start    "} alignItems={"start"}>

                <Heading mb={4} color={"gray.600"} fontSize={"3xl"}>Empleados de mayor salario</Heading>

                <div className="w-[100%] h- justify-evenly flex">
                    <div className="w-[50%] max-h-[50vh] rounded-lg p-6 bg-white shadow-xl">

                        <BarChart data={employees} />
                    </div>
                    <div className="w-[30%] flex justify-center mb-10 max-h-[50vh] rounded-lg p-6 bg-white shadow-xl">

                        <PieChart data={dataPayments || []} />
                    </div>

                </div>
            </Flex>
        </>
    );
}
