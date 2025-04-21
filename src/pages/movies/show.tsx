import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Card, Collapse, Descriptions, Image, Space, Tag, Typography } from "antd";
import React from "react";

import type { Movie } from "../../common/types";
import { JsonView } from "../../components/ui/json-view";

const { Text, Title } = Typography;
const { Panel } = Collapse;

export const MovieShow: React.FC = () => {
  const { query } = useShow<Movie>();
  const { data, isLoading } = query;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      {record && (
        <>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", marginBottom: 20 }}>
              <div style={{ marginRight: 20 }}>
                <Image
                  alt={record.title}
                  fallback="https://placehold.co/200x300?text=No+Image"
                  height={300}
                  src={record.poster}
                  style={{ objectFit: "cover" }}
                  width={200}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Title level={3}>{record.title}</Title>
                <Space style={{ marginBottom: 20 }}>
                  {record.tags.map((tag) => (
                    <Tag color="blue" key={tag}>
                      {tag}
                    </Tag>
                  ))}
                </Space>
                <Descriptions column={1}>
                  <Descriptions.Item label="Episodes">
                    {record.episodes || 0}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
            <div>
              <Title level={4}>Description</Title>
              <Text>{record.description}</Text>
            </div>
          </Card>

          <Collapse style={{ marginTop: 16 }}>
            <Panel header="Movie Data" key="1">
              <JsonView data={record} />
            </Panel>
          </Collapse>
        </>
      )}
    </Show>
  );
};