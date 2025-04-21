import { Show } from "@refinedev/antd";
import { useMany, useShow } from "@refinedev/core";
import { Avatar, Card, Collapse, Image, List, Space, Tag, Typography } from "antd";
import React from "react";
import { type Movie, type Section, SectionEnum, sectionTypeColors } from "../../common/types";
import { JsonView } from "../../components/ui/json-view";

const { Text, Title } = Typography;
const { Panel } = Collapse;

export const SectionShow: React.FC = () => {
  const { query } = useShow<Section>();
  const { data, isLoading } = query;
  const record = data?.data;

  // Only fetch movies if this is a HeroSlider or has items
  const shouldFetchMovies = (record?.items && record.items.length > 0);
  
  const { data: moviesData, isLoading: moviesLoading } = useMany<Movie>({
    ids: record?.items || [],
    queryOptions: {
      enabled: !!shouldFetchMovies,
    },
    resource: "movies",
  });

  return (
    <Show isLoading={isLoading}>
      {record && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <Card>
            <Title level={3}>{record.title}</Title>
            <Space style={{ marginBottom: 16 }}>
              <Tag color={sectionTypeColors[record.type]}>{record.type}</Tag>
            </Space>
            {record.description && (
              <div style={{ marginBottom: 16 }}>
                <Title level={5}>Description</Title>
                <Text>{record.description}</Text>
              </div>
            )}
          </Card>

          {record.design && (
            <Card title="Section Design">
              <div style={{ textAlign: "center" }}>
                <Image 
                  alt="Section Design"
                  fallback="https://placehold.co/600x400?text=No+Design+Image"
                  src={record.design}
                  style={{ maxHeight: "500px", maxWidth: "100%" }}
                />
                <Text style={{ display: "block", marginTop: 8 }} type="secondary">
                  Design mockup showing how this section should look in the app
                </Text>
              </div>
            </Card>
          )}

          {shouldFetchMovies && (
            <Card title="Movies in this Section">
              {moviesLoading ? (
                <Text>Loading movies...</Text>
              ) : (
                <List
                  dataSource={moviesData?.data || []}
                  itemLayout="horizontal"
                  renderItem={(movie) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar 
                            alt={movie.title} 
                            shape="square" 
                            size={64} 
                            src={movie.poster}
                          />
                        }
                        description={
                          <Space>
                            {movie.tags?.map((tag) => (
                              <Tag key={tag}>{tag}</Tag>
                            ))}
                            {movie.views !== undefined && <Tag color="blue">Views: {movie.views}</Tag>}
                          </Space>
                        }
                        title={movie.title}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          )}

          {record.type !== SectionEnum.HeroSlider && (
            <Card title="Section Content">
              <Text>This section type is auto-populated based on its type: <strong>{record.type}</strong></Text>
              <div style={{ marginTop: 16 }}>
                {record.type === SectionEnum.TopChart && (
                  <Text type="secondary">Shows movies ranked by user ratings</Text>
                )}
                {record.type === SectionEnum.MostTrending && (
                  <Text type="secondary">Shows currently trending content</Text>
                )}
                {record.type === SectionEnum.ContinueWatching && (
                  <Text type="secondary">Shows content users have started but not finished</Text>
                )}
                {record.type === SectionEnum.MostPopular && (
                  <Text type="secondary">Shows most-watched content</Text>
                )}
              </div>
            </Card>
          )}

          <Collapse style={{ marginTop: 16 }}>
            <Panel header="Section Data" key="1">
              <JsonView data={record} />
            </Panel>
          </Collapse>
        </div>
      )}
    </Show>
  );
};