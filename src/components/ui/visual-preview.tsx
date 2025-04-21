import { Image, Typography } from "antd";
import React, { useLayoutEffect } from "react";

import { useScreenPreview } from "../../hooks/use-screen-preview";

const { Title } = Typography;

interface VisualPreviewProps {
  sectionIds?: string[];
}

export const VisualPreview: React.FC<VisualPreviewProps> = ({ sectionIds }) => {
  const { 
    concatenatedPreview,
    generateConcatenatedPreview,
  } = useScreenPreview(sectionIds);

  // Generate the concatenated preview automatically when component mounts or sectionIds change
  useLayoutEffect(() => {
    if (sectionIds?.length) {
      generateConcatenatedPreview();
    }
  }, [sectionIds, generateConcatenatedPreview]);

  if(!sectionIds?.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>Visual Preview</Title>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {sectionIds && sectionIds?.length && <Image
                alt="Full screen preview"
                src={concatenatedPreview}
                style={{ maxWidth: "100%" }}
              />}
      </div>
    </div>
  );
};