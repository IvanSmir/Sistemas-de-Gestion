import React from 'react'
interface BtnAddProps {
    onClick: () => void;
}

export const BtnEdit: React.FC<BtnAddProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} className="bg-yellow-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Edit
        </button>
    )
}