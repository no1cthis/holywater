import React from "react";
import ReactJson from "react-json-view";

interface JsonSchemaPreviewProps {
  data?: any;
}

/**
 * A reusable component for previewing JSON schema
 * 
 * @param data - Static data to display (used if formRef is not available)
 */
export const JsonView: React.FC<JsonSchemaPreviewProps> = ({
  data,
}) => {

  return (
    <ReactJson 
      collapsed={2} 
      displayDataTypes={false} 
      name={null} 
      src={data} 
      theme="ocean" 
    />
  );
};