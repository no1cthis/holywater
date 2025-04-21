import { Create, useForm } from "@refinedev/antd";
import { default as AntdForm } from "@rjsf/antd";
import type Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Tabs } from "antd";
import React, { useRef, useState } from "react";

import type { ScreenConfiguration } from "../../common/types";
import { JsonView } from "../../components/ui/json-view";
import { VisualPreview } from "../../components/ui/visual-preview";
import { screenConfigurationJsonSchema, screenConfigurationUiSchema } from "../../schemas/screen-configuration.schema";

export const ScreenConfigurationCreate: React.FC = () => {
  const { onFinish } = useForm<ScreenConfiguration>();
  const [formData, setFormData] = useState<any>({});
  const formDataRef = useRef<Form>(null);

  const handleFormSubmit = async (data: ScreenConfiguration) => {
    try {
      if(!formDataRef.current?.validateForm()) {
        return;
      }
      await onFinish(data);
    } catch (error) {
      console.error("Error creating screen configuration:", error);
    }
  };

  return (
    <Create saveButtonProps={{ onClick: () => { formDataRef.current?.submit(); } }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <AntdForm
          formData={formData}
          onChange={(e) => { setFormData(e.formData); }}
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
      </div>
    </Create>
  );
};