import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@heroui/react";
import { Editor } from "@tiptap/react";

interface LinkUpResetProps {
  editor?: Editor | null;
}

const LinkUpReset: React.FC<LinkUpResetProps> = ({ editor }) => {
  const { reset } = useFormContext(); // Access the reset method

  const handleReset = () => {
    if (editor) {
      editor.commands.setContent(""); // Reset the editor content
    }
    reset(); // Resets the form to default values
  };

  return (
    <Button type="button" size="sm" variant="bordered" onClick={handleReset}>
      Reset
    </Button>
  );
};

export default LinkUpReset;
