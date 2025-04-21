import { Create, useForm } from "@refinedev/antd";
import { default as AntdForm } from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import { Collapse } from "antd";
import React, { useRef, useState } from "react";

import type Form from "@rjsf/core";
import type { Movie } from "../../common/types";
import { JsonView } from "../../components/ui/json-view";
import { movieJsonSchema, movieUiSchema } from "../../schemas/movie.schema";
import { uploadImageToStorage } from "../../utils/upload-image-to-storage";

const { Panel } = Collapse;

export const MovieCreate: React.FC = () => {
  const { onFinish } = useForm<Movie>();
  const [formData, setFormData] = useState<Partial<Movie>>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const formRef = useRef<Form>(null);

  const handleSubmit = async () => {
    try {
      setIsUploading(true);

      // Submit the form with the updated URL
      const updatedFormData = {
        ...formData,
        poster: formData.poster && await uploadImageToStorage(formData.poster),
      };

      if(!formRef.current?.validateForm()){
        console.error("Form validation failed");
        return;
      }

      
      
      await onFinish(updatedFormData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <Create saveButtonProps={{ loading: isUploading, onClick: handleSubmit }}>
      <>
        <AntdForm
          ref={formRef}
          formData={formData}
          onChange={e => { setFormData(e.formData); }}
          onSubmit={handleSubmit}
          schema={movieJsonSchema}
          showErrorList={false}
          uiSchema={movieUiSchema}
          validator={validator}
          children={[]} // Prevents the default rendering of the form
        />
        
        <Collapse style={{ marginTop: 16 }}>
          <Panel header="Form Data Preview" key="1">
            <JsonView data={formData} />
          </Panel>
        </Collapse>
      </>
    </Create>
  );
};