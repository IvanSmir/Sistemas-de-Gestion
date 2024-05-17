'use client'
import { getEmployees } from '@/utils/employee.http'
import React, { useCallback, useState } from 'react'



interface Root {
    id: string
    enterDate: string
    person: Person
}

interface Person {
    ciRuc: string
    name: string
    email: string
    phone: string
    address: string
    birthDate: string
}




const transformedDate = (fecha: string) => {
    const today = new Date();
    const birth = new Date(fecha);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();

    // Ajustar si el cumpleaños aún no ha llegado este año
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
}
const transformData = (data: Root[]) => {
    return data.map(datum => ({
        ...datum, person: { age: transformedDate(datum.person.birthDate), ...datum.person }
    }));
};

type PaginationProps = {
    setEmployeedata: any
    total: number
}

export const Pagination: React.FC<PaginationProps> = ({ setEmployeedata, total }) => {
    const [selected, setSelected] = useState(1)
    const fetchData = useCallback(async ({ page }: { page: number }) => {
        try {
            const data = await getEmployees(page)
            setEmployeedata(transformData(data.data));
            console.log(data);
        } catch (error) {
            console.error('Error al obtener los empleados:', error);
        }
    }, [setEmployeedata]);

    const handleLowerSelect = useCallback(() => {
        if (selected > 1) {
            const newSelected = selected - 1
            fetchData({ page: newSelected })
            setSelected(newSelected)
        }
    }, [selected, fetchData])

    const handleUpperSelect = useCallback(() => {
        if (selected < total) {

            const newSelected = selected + 1
            fetchData({ page: newSelected })
            setSelected(newSelected)
        }
    }, [selected, fetchData, total])

    const getClassNameBySelected = useCallback((selected = false) => {
        if (selected) return "w-[2.7%] flex text-center items-center justify-center aspect-square rounded-lg text-white bg-[#AA546D]"
        else return "cursor-pointer transition-all duration-300 w-[2.7%] flex text-center items-center justify-center aspect-square bg-[#F6F6F6] rounded-lg text-black hover:text-white hover:bg-[#AA546D]"
    }, [])

    return (
        <>
            <div className="flex justify-center gap-2 w-full  bottom-3 select-none mt-2 ">
                <button className={getClassNameBySelected(false)} onClick={() => { handleLowerSelect() }}> {"<"} </button>
                {total > 0 && Array.from({ length: total }, (_, i) => i + 1).map((page) => {
                    return <button key={page} className={getClassNameBySelected(page === selected)} onClick={() => { fetchData({ page }) }}>{page}</button>
                })}
                <button className={getClassNameBySelected(false)} onClick={() => { handleUpperSelect() }}> {">"} </button>
            </div>
        </>
    )
}
export default Pagination;