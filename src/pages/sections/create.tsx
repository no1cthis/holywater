import { Create, useForm } from "@refinedev/antd";
import { default as AntdForm } from "@rjsf/antd";
import type Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Collapse } from "antd";
import React, { useRef, useState } from "react";

import { type Section, SectionEnum } from "../../common/types";
import { JsonView } from "../../components/ui/json-view";
import { sectionJsonSchema, sectionUiSchema } from "../../schemas/section.schema";
import { uploadImageToStorage } from "../../utils/upload-image-to-storage";


const { Panel } = Collapse;

export const SectionCreate: React.FC = () => {
  const { onFinish } = useForm<Section>();
  const formRef = useRef<Form>(null);
  const [formData, setFormData] = useState<any>({});
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFormSubmit = async () => {
    try {
      setIsUploading(true);
      // For non-HeroSlider sections, ensure items is an empty array
      if (formData.type !== SectionEnum.HeroSlider && !formData.items) {
        formData.items = [];
      }
      
      // Submit the form with the updated URL
      const updatedFormData = {
        ...formData,
        design: await uploadImageToStorage(formData.design),
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

  const handleFormChange = ({ formData }: any) => {
    setFormData(formData);
  };

  return (
    <Create saveButtonProps={{
      loading: isUploading,
      onClick: handleFormSubmit,
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <AntdForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          ref={formRef}
          schema={sectionJsonSchema}
          uiSchema={sectionUiSchema}
          validator={validator}
          children={[]} // Prevents the default rendering of the form
        />
        
        <Collapse style={{ marginTop: 16 }}>
          <Panel header="Section Data Preview" key="1">
            <JsonView data={formData} />
          </Panel>
        </Collapse>
      </div>
    </Create>
  );
};