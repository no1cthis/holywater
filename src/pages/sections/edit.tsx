import { Edit } from "@refinedev/antd";
import { useForm } from "@refinedev/core";
import { default as AntdForm } from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import { Collapse } from "antd";
import React, { useEffect, useRef, useState } from "react";

import type Form from "@rjsf/core";
import { type Section, SectionEnum } from "../../common/types";
import { JsonView } from "../../components/ui/json-view";
import { sectionJsonSchema, sectionUiSchema } from "../../schemas/section.schema";
import { uploadImageToStorage } from "../../utils/upload-image-to-storage";

const { Panel } = Collapse;

export const SectionEdit: React.FC = () => {
  const {onFinish, query} = useForm<Section>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Section | undefined>(query?.data?.data);
  const formRef = useRef<Form>(null);

  useEffect(() => {
    if (query?.data?.data) {
      setFormData(query.data.data);
    }
  }, [query?.data?.data]);

  const handleFormSubmit = async () => {
     try {
      if(!formData) return;
          setIsUploading(true);
          // For non-HeroSlider sections, ensure items is an empty array
          if (formData.type !== SectionEnum.HeroSlider && !formData.items) {
            formData.items = [];
          }
                
          // Upload the poster to storage if it's a data URL
          const design = await uploadImageToStorage(formData.design!);
          
          // Submit the form with the updated URL
          const updatedFormData = {
            ...formData,
            design,
          };

                
          if(!formRef.current?.validateForm()) {
            return;
          }

          
          await onFinish(updatedFormData);
        } catch (error) {
          console.error("Error submitting form:", error);
        }finally{
          setIsUploading(false);
        }
  };

  const handleFormChange = ({ formData: newFormData }: any) => {
    setFormData(newFormData);
  };

  return (
    <Edit saveButtonProps={{loading: isUploading, onClick: handleFormSubmit}}>
      {query?.data?.data && formData && (
        <>
          <AntdForm
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleFormSubmit}
            schema={sectionJsonSchema}
            uiSchema={sectionUiSchema}
            validator={validator}
            ref={formRef}
             children={[]} // Prevents the default rendering of the form
          />
          
          <Collapse style={{ marginTop: 16 }}>
            <Panel header="Section Data Preview" key="1">
              <JsonView data={formData} />
            </Panel>
          </Collapse>
        </>
      )}
    </Edit>
  );
};