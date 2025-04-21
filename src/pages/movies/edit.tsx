import { Edit, useForm } from "@refinedev/antd";
import { default as AntdForm } from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import { Collapse } from "antd";
import React, { useEffect, useRef, useState } from "react";

import type Form from "@rjsf/core";
import type { Movie } from "../../common/types";
import { JsonView } from "../../components/ui/json-view";
import { movieJsonSchema, movieUiSchema } from "../../schemas/movie.schema";
import { uploadImageToStorage } from "../../utils/upload-image-to-storage";

const { Panel } = Collapse;

export const MovieEdit: React.FC = () => {
  const { formProps, query, saveButtonProps } = useForm<Movie>();
  const [formData, setFormData] = useState<Movie | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const formRef = useRef<Form>(null);

  useEffect(() => {
    if (query?.data?.data) {
      const movieData = query.data.data;
      
      // Convert episodesTotal from the existing data structure if it exists
      const enrichedData = { ...movieData };
      
      setFormData(enrichedData);
    }
  }, [query?.data?.data]);

  const handleSubmit = async () => {
    try {
      if (!formData) return;
      
      // Submit the form with the updated URL
      const updatedData = {
        ...formData,
        poster: await uploadImageToStorage(formData.poster),
      };

      if(!formRef.current?.validateForm()){
        return;
      }
      
      await formProps.onFinish?.(updatedData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Edit saveButtonProps={{...saveButtonProps, loading: isUploading, onClick: handleSubmit}}>
      {formData && (
        <>
          <AntdForm
            ref={formRef}
            formData={formData}
            onChange={(e) => { setFormData(e.formData); }}
            onSubmit={handleSubmit}
            schema={movieJsonSchema}
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
      )}
    </Edit>
  );
};