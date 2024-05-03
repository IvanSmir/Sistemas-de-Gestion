interface BtnAddProps {
    onClick: () => void;
  }
  
  export const btnAdd: React.FC<BtnAddProps> = ({ onClick }) => {
    return (
      <button onClick={onClick}>Agregar</button>
    );
  };
  