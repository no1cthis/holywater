import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";

import { PlusOutlined } from "@ant-design/icons";
import { useSelect } from "@refinedev/antd";
import type { WidgetProps } from "@rjsf/utils";
import { message, Select, Upload } from "antd";
import React, { type ComponentProps, useState } from "react";

import { resizeBase64Image } from "../../utils/resize-base64-image";
import { DraggableMultiSelect } from "../ui/draggable-multi-select";


// Factory function to create image upload widgets for different purposes
export const createImageUploadWidget = (imageType: string, options: {
  format?: 'jpeg' | 'png' | 'webp'; // Output format
  height?: number; // Target height for resizing
  maxSize?: number; // in MB
  quality?: number; // Output quality (0-1)
  resize?: boolean; // Whether to resize the image
  uploadText?: string;
  width?: number; // Target width for resizing
} = {}) => {
  const {
    format = 'jpeg', // Default format
    height = 600, // Default height
    maxSize = 2, // Default max size is 2MB
    quality = 0.9, // Default quality
    resize = false, // Disable resizing by default
    uploadText = "Upload",
    width = 800, // Default width
  } = options;

  // The actual widget component created by the factory
  const ImageWidget: React.FC<WidgetProps> = (props) => {
    const { disabled, onChange, readonly, value } = props;
    const [previewImage, setPreviewImage] = useState<string>(value || "");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Convert image to base64
    const getBase64 = async (file: RcFile): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => { resolve(reader.result as string); };
        reader.onerror = (error) => { reject(error); };
      });

    // Handle before upload to validate file type and size
    const beforeUpload = (file: RcFile) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
      if (!isLtMaxSize) {
        message.error(`Image must be smaller than ${maxSize}MB!`);
        return false;
      }
      return true;
    };

    // Handle file change
    const handleChange: UploadProps['onChange'] = async ({ file, fileList }) => {
      setFileList(fileList);
      
      if (file.status === 'uploading') {
        setLoading(true);
        return;
      }
      
      if (file.status === 'done' || file.status === 'error') {
        setLoading(false);
      }
      
      // Convert to base64 when a file is selected
      if (file.originFileObj) {
        try {
          const base64 = await getBase64(file.originFileObj);
          
          // Resize the image if resize option is enabled
          if (resize) {
            try {
              const resizedBase64 = await resizeBase64Image(base64, width, height, format, quality);
              setPreviewImage(resizedBase64);
              onChange(resizedBase64);
            } catch (resizeError) {
              console.error(`Error resizing ${imageType}:`, resizeError);
              // Fallback to original base64 if resizing fails
              setPreviewImage(base64);
              onChange(base64);
            }
          } else {
            // Use original base64 without resizing
            setPreviewImage(base64);
            onChange(base64);
          }
        } catch (error) {
          console.error(`Error converting ${imageType} to base64:`, error);
          message.error(`Failed to process ${imageType}`);
        }
      }
    };

    // Custom request implementation to handle the file directly without server upload
    const customRequest: ComponentProps<typeof Upload>["customRequest"] = async (options) => {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64String = e.target?.result as string;
          
          // Resize the image if resize option is enabled
          if (resize) {
            try {
              const resizedBase64 = await resizeBase64Image(base64String, width, height, format, quality);
              onChange(resizedBase64);
              options.onSuccess?.({ url: resizedBase64 });
            } catch (resizeError) {
              console.error(`Error resizing ${imageType}:`, resizeError);
              // Fallback to original base64 if resizing fails
              onChange(base64String);
              options.onSuccess?.({ url: base64String });
            }
          } else {
            // Use original base64 without resizing
            onChange(base64String);
            options.onSuccess?.({ url: base64String });
          }
        };
        reader.onerror = (error) => {
          console.error(`Error reading ${imageType} file:`, error);
          options.onError?.(new Error(`Failed to read ${imageType} file`));
        };
        reader.readAsDataURL(options.file as File);
      } catch (error) {
        console.error(`Error processing ${imageType}:`, error);
        options.onError?.(new Error(`Failed to process ${imageType}`));
      }
    };

    return (
      <div>
        <Upload
          beforeUpload={beforeUpload}
          customRequest={customRequest}
          disabled={disabled || readonly}
          fileList={fileList}
          listType="picture-card"
          name={imageType}
          onChange={handleChange}
          showUploadList={false}
        >
          {previewImage ? (
            <img 
              alt={imageType} 
              src={previewImage} 
              style={{ height: '100%', objectFit: 'contain', width: '100%' }} 
            />
          ) : (
            <div>
              {loading ? 'Loading...' : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>{uploadText}</div>
            </div>
          )}
        </Upload>
        {previewImage && (
          <button
            disabled={disabled || readonly}
            onClick={() => {
              setPreviewImage('');
              setFileList([]);
              onChange('');
            }}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#ff4d4f', 
              cursor: 'pointer', 
              marginTop: 8 
            }}
            type="button"
          >
            Remove
          </button>
        )}
      </div>
    );
  };

  return ImageWidget;
};

// Create specific image widget instances with resize options
export const ImageUploadWidget = createImageUploadWidget('poster', {
  format: 'jpeg',
  height: 900,
  quality: 1,
  resize: true,
  width: 600
});

export const DesignImageWidget = createImageUploadWidget('design');

// Custom Tags Widget using Ant Design Select
export const TagsWidget: React.FC<WidgetProps> = (props) => {
  const { disabled, onChange, readonly, value = [] } = props;
  const [inputValue, setInputValue] = useState<string>('');
  
  const handleChange = (selected: string[]) => {
    onChange(selected);
  };
  
  const handleInputChange = (input: string) => {
    setInputValue(input);
  };

  const handleInputConfirm = () => {
    if (inputValue && !value.includes(inputValue)) {
      const newTags = [...value, inputValue];
      onChange(newTags);
    }
    setInputValue('');
  };

  // Common tag options that might be useful
  const commonTags = ['Action', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Sci-Fi', 'Adventure', 'Romance', 'Documentary', 'Anime', 'Exclusive'];

  // Options for the select component
  const options = commonTags.map(tag => ({ label: tag, value: tag }));

  return (
    <Select
      disabled={disabled || readonly}
      mode="tags"
      onBlur={handleInputConfirm}
      onChange={handleChange}
      onSearch={handleInputChange}
      options={options}
      placeholder="Enter or select tags"
      style={{ width: '100%' }}
      tokenSeparators={[',']}
      value={value}
    />
  );
};

// Generic factory function to create resource select widgets
export const createResourceSelectWidget = (
  resource: string, 
  options: {
    allowedTypes?: string[];
    mode?: "multiple" | "tags";
    optionLabel?: string;
    optionValue?: string;
    placeholder?: string;
    restrictionMessage?: string;
    typeCheckField?: string;
    useDraggable?: boolean;
  } = {}
) => {
  const {
    allowedTypes = [], // Empty array means all types allowed
    mode = "multiple",
    optionLabel = "title",
    placeholder = `Select ${resource}`,
    restrictionMessage = `This type doesn't support ${resource} items`,
    typeCheckField = "type",
    useDraggable = false
  } = options;

  // The actual widget component created by the factory
  const ResourceSelectWidget: React.FC<WidgetProps> = (props) => {
    const { disabled, formContext, onChange: formOnChange, readonly, value = [] } = props;
    
    // Check if this type should have items from the resource
    const itemType = formContext?.formData?.[typeCheckField];
    const allowItems = allowedTypes.length === 0 || !itemType || allowedTypes.includes(itemType);
    
    // Use Refine's useSelect hook for data fetching
    const { selectProps } = useSelect({
      onSearch: (value) => [
        {
          field: `${optionLabel}_like`,
          operator: "contains",
          value,    
        },
      ],
      // Don't fetch if type doesn't allow items
      queryOptions: {
        enabled: allowItems,
      },
      resource,
    });
    
    const handleChange = (selected: string[]) => {
      // Only allow changes if type permits items
      formOnChange(selected);
    };
    
    // Show a message if type doesn't allow items
    if (!allowItems) {
      return (
        <div style={{ color: '#ff4d4f', marginBottom: '8px' }}>
          {restrictionMessage}
        </div>
      );
    }

    // Return either a DraggableMultiSelect or a regular Select component
    if (useDraggable && mode === "multiple") {
      return (
        <DraggableMultiSelect
          disabled={disabled || readonly}
          filterOption={false}
          mode={mode}
          onChange={handleChange}
          options={selectProps.options}
          placeholder={placeholder}
          value={value}
        />
      );
    }

    return (
      <Select
        options={selectProps.options}
        disabled={disabled || readonly}
        filterOption={false}
        mode={mode}
        onChange={handleChange}
        placeholder={placeholder}
        style={{ width: '100%' }}
        value={value}
      />
    );
  };

  return ResourceSelectWidget;
};

// Custom Movies Select Widget using Ant Design Select
export const MovieSelectWidget = createResourceSelectWidget("movies", {
  allowedTypes: ['HeroSlider'],
  restrictionMessage: "This section type doesn't support movie items",
  typeCheckField: "type",
  useDraggable: true
});

// Custom Section Select Widget using Ant Design Select
export const SectionSelectWidget = createResourceSelectWidget("sections", {
  placeholder: "Select sections to include in this configuration",
  useDraggable: true,
});