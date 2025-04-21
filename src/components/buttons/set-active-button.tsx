// filepath: /Users/mykyta/projects/holywater/src/components/SetActiveButton.tsx
import { CheckCircleOutlined } from "@ant-design/icons";
import { type BaseKey, useNotification } from "@refinedev/core";
import { Button, Tooltip } from "antd";
import axios from "axios";
import React, { useState } from "react";

interface SetActiveButtonProps {
  disabled?: boolean;
  hideText?: boolean;
  onSuccess?: (configId: BaseKey) => void;
  recordItemId?: BaseKey;
  size?: "large" | "middle" | "small";
}

export const SetActiveButton: React.FC<SetActiveButtonProps> = ({
  disabled = false,
  hideText = false,
  onSuccess,
  recordItemId,
  size = "middle",
}) => {
  const [loading, setLoading] = useState(false);
  const { open } = useNotification();

  const handleSetActive = async () => {
    if (!recordItemId) return;

    try {
      setLoading(true);

      const response = await axios.post("/api/screen/set", {
        id: recordItemId,
      });
      
      if (response.status === 200) {
        open?.({
          description: "Screen configuration set as active successfully",
          message: "Success",
          type: "success",
        });
        
        // Call the onSuccess callback if provided
        if (onSuccess) {
          onSuccess(recordItemId);
        }
      } else {
        throw new Error("Failed to set active configuration");
      }
    } catch (error) {
      open?.({
        description: "Failed to set screen configuration as active",
        message: "Error",
        type: "error",
      });
      console.error("Error setting active screen configuration:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={disabled ? "This configuration is already active" : "Set as active configuration"}>
      <Button
        disabled={disabled}
        ghost
        icon={<CheckCircleOutlined />}
        loading={loading}
        onClick={handleSetActive}
        size={size}
        type="primary"
      >
        {hideText ? "" : "Set Active"}
      </Button>
    </Tooltip>
  );
};