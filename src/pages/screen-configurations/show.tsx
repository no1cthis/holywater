import { Show } from "@refinedev/antd";
import { useMany, useShow } from "@refinedev/core";
import { Card, List, Space, Tabs, Tag, Typography } from "antd";
import React from "react";

import type { ScreenConfiguration, Section } from "../../common/types";
import { SetActiveButton } from "../../components/buttons/set-active-button";
import { JsonView } from "../../components/ui/json-view";
import { VisualPreview } from "../../components/ui/visual-preview";
import { useActiveConfig } from "../../hooks/use-active-config";

const { Text, Title } = Typography;

export const ScreenConfigurationShow: React.FC = () => {
  const { query } = useShow<ScreenConfiguration>();
  const { data, isLoading } = query;
  const record = data?.data;
  const { activeConfigId, changeActiveConfig } = useActiveConfig();

  const { data: sectionsData, isLoading: sectionsLoading } = useMany<Section>({
    ids: record?.sections || [],
    queryOptions: {
      enabled: !!record?.sections.length,
    },
    
    resource: "sections",
  });

  const isActive = record && activeConfigId === record.id;

  return (
    <Show 
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}
          {record && (
            <SetActiveButton 
              disabled={isActive} 
              onSuccess={changeActiveConfig} 
              recordItemId={record.id}
            />
          )}
        </>
      )}
      isLoading={isLoading}
    >
      {record && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Card>
            <Title level={3}>
              {record.name}
              {isActive && (
                <Tag color="green" style={{ marginLeft: 8, verticalAlign: "middle" }}>
                  Active
                </Tag>
              )}
            </Title>
            {record.description && (
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>Description</Title>
                <Text>{record.description}</Text>
              </div>
            )}
          </Card>

          <Card title="Sections in this Configuration">
            {sectionsLoading ? (
              <Text>Loading sections...</Text>
            ) : (
              <List
                dataSource={sectionsData?.data || []}
                itemLayout="horizontal"
                renderItem={(section, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <div style={{ 
                          alignItems: "center", 
                          background: "#f5f5f5", 
                          borderRadius: 4, 
                          display: "flex", 
                          height: 40, 
                          justifyContent: "center",
                          width: 40 
                        }}>
                          {index + 1}
                        </div>
                      }
                      description={
                        <div>
                          {section.description && <div>{section.description}</div>}
                          <div>Movies: {section.items?.length || 0}</div>
                        </div>
                      }
                      title={
                        <Space>
                          <span>{section.title}</span>
                          <Tag color={getTypeColor(section.type)}>{section.type}</Tag>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
          
          <Card>
            <Tabs
              defaultActiveKey="visual"
              items={[
                {
                  children: <VisualPreview sectionIds={record.sections} />,
                  key: "visual",
                  label: "Visual Preview"
                },
                {
                  children: <JsonView data={record} />,
                  key: "json",
                  label: "JSON Preview"
                }
              ]}
            />
          </Card>
        </div>
      )}
    </Show>
  );
};

const getTypeColor = (type: string): string => {
  switch (type) {
    case "ContinueWatching":
      return "cyan";
    case "HeroSlider":
      return "magenta";
    case "MostPopular":
      return "purple";
    case "MostTrending":
      return "green";
    case "TopChart":
      return "gold";
    default:
      return "blue";
  }
};