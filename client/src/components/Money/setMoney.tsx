import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Input,
  useEditableControls,
  Text,
} from "@chakra-ui/react";

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton
        icon={<CheckIcon />}
        aria-label="Submit"
        {...getSubmitButtonProps()}
        mr={2} // Aumentar el margen derecho
        bg="transparent" // Hacer el fondo transparente
      />
      <IconButton
        icon={<CloseIcon />}
        aria-label="Cancel"
        {...getCancelButtonProps()}
        bg="transparent" // Hacer el fondo transparente
      />
    </ButtonGroup>
  ) : (
    <IconButton
      size="sm"
      icon={<EditIcon />}
      aria-label="Edit"
      {...getEditButtonProps()}
      mr={2} // Aumentar el margen derecho
      bg="transparent" // Hacer el fondo transparente
    />
  );
}

function CustomEditable({
  defaultValue,
  label,
}: {
  defaultValue: string,
  label: string,
}) {
  return (
    <Flex mb={8} alignItems="center">
      <Text mr={4} fontWeight="bold" flexBasis="100px">
        {label}
      </Text>
      <Editable
        textAlign="center"
        defaultValue={defaultValue}
        fontSize="xl"
        isPreviewFocusable={false}
        flex="1"
        whiteSpace="nowrap"
        maxWidth="100%" // Establecer el ancho máximo al 100% para que ocupe todo el espacio disponible
      >
        <EditablePreview />
        <Input
          as={EditableInput}
          bg="gray.100"
          border="1px solid"
          borderColor="gray.300" // Color del borde gris claro
          borderRadius="md"
          px={4} // Aumentar el padding horizontal para más espacio dentro del Input
          _focus={{
            borderColor: "gray.300", // Cambiar el color del borde al enfocar el Input
            boxShadow: "none", // Eliminar la sombra al enfocar el Input
          }}
        />
        <EditableControls />
      </Editable>
    </Flex>
  );
}

export function EditableExample() {
  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Box p={5}>
        <CustomEditable defaultValue="50000" label="Salario Actual" />
        <CustomEditable defaultValue="15000" label="IPS" />
        <CustomEditable defaultValue="10000" label="Bonificaciones" />
      </Box>
    </Flex>
  );
}

export default EditableExample;
