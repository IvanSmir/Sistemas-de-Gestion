'use client'
import React, { useCallback, useState } from 'react'
export const Pagination = () => {
    const [selected, setSelected] = useState(1)

    const handleLowerSelect = useCallback(() => {
        if (selected > 1) {
            const newSelected = selected - 1
            setSelected(newSelected)
        }
    }, [selected])

    const handleUpperSelect = useCallback(() => {
        if (selected < 3) {
            const newSelected = selected + 1
            setSelected(newSelected)
        }
    }, [selected])

    const getClassNameBySelected = useCallback((selected = false) => {
        if (selected) return "w-[2.7%] flex text-center items-center justify-center aspect-square rounded-lg text-white bg-[#AA546D]"
        else return "cursor-pointer transition-all duration-300 w-[2.7%] flex text-center items-center justify-center aspect-square bg-[#F6F6F6] rounded-lg text-black hover:text-white hover:bg-[#AA546D]"
    }, [])

    return (
        <>
            <div className="flex justify-center gap-2 w-full absolute bottom-3 select-none">
                <button className={getClassNameBySelected(false)} onClick={() => { handleLowerSelect() }}> {"<"} </button>
                <button className={getClassNameBySelected(selected === 1)} onClick={() => { setSelected(1) }}> {1} </button>
                <button className={getClassNameBySelected(selected === 2)} onClick={() => { setSelected(2) }}> {2} </button>
                <button className={getClassNameBySelected(selected === 3)} onClick={() => { setSelected(3) }}> {3} </button>
                <button className={getClassNameBySelected(false)} onClick={() => { handleUpperSelect() }}> {">"} </button>
            </div>
        </>
    )
}
export default Pagination;