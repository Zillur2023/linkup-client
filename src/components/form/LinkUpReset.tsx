import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@heroui/react";

const LinkUpReset = () => {
  const { reset } = useFormContext(); // Access the reset method

  const handleReset = () => {
    reset(); // Resets the form to default values
  };

  return (
    <Button type="button" size="sm" variant="bordered" onClick={handleReset}>
      Reset
    </Button>
  );
};

export default LinkUpReset;
