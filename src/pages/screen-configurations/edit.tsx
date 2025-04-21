import { Edit } from "@refinedev/antd";
import { useForm } from "@refinedev/core";
import { default as AntdForm } from "@rjsf/antd";
import type Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Tabs } from "antd";
import React, { useEffect, useRef, useState } from "react";

import type { ScreenConfiguration } from "../../common/types";
import { JsonView } from "../../components/ui/json-view";
import { VisualPreview } from "../../components/ui/visual-preview";
import { screenConfigurationJsonSchema, screenConfigurationUiSchema } from "../../schemas/screen-configuration.schema";

export const ScreenConfigurationEdit: React.FC = () => {
  const {onFinish, query} = useForm<ScreenConfiguration>()
  const [formData, setFormData] = useState<null | ScreenConfiguration>(null);
  const formDataRef = useRef<Form>(null);

  useEffect(() => {
    if (query?.data?.data) {
      setFormData(query.data.data);
    }
  }, [query?.data?.data]);

  const handleFormSubmit = async (submittedFormData: ScreenConfiguration) => {
    try {
      if(!formDataRef.current?.validateForm()) {
        return;
      }
      onFinish(submittedFormData);
    } catch (error) {
      console.error("Error updating screen configuration:", error);
    }
  };

  const handleFormChange = (data: ScreenConfiguration) => {
    setFormData(data);
  };

  return (
    <Edit saveButtonProps={{ onClick: () => formDataRef.current?.submit() }}>
      {query?.data?.data && formData && (
        <>
          <AntdForm
            formData={formData}
            onChange={(e) => { handleFormChange(e.formData); }}
            onSubmit={async (e) => handleFormSubmit(e.formData)}
            ref={formDataRef}
            schema={screenConfigurationJsonSchema}
            uiSchema={screenConfigurationUiSchema}
            validator={validator}
            children={[]} // Prevents the default rendering of the form
          />

          <Tabs
            defaultActiveKey="dataPreview"
            items={[
              {
                children: <JsonView data={formData} />,
                key: "dataPreview",
                label: "Configuration Data Preview",
              },
              {
                children: <VisualPreview sectionIds={formData.sections} />,
                key: "visualPreview",
                label: "Visual Preview",
              },
            ]}
            style={{ marginTop: 16 }}
          />
        </>
      )}
    </Edit>
  );
};