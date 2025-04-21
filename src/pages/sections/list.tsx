import {
  DeleteButton,
  EditButton,
  getDefaultSortOrder,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Image, Space, Table, Tag } from "antd";
import React from "react";

import { type Section, SectionEnum, type SectionEnumType, sectionTypeColors } from "../../common/types";
import { FilterContainer, FilterInput } from "../../components/filters/filter-input";
import { useFilterHandling } from "../../hooks/use-filter-handling";




export const SectionList: React.FC = () => {
  const { filters, setFilters, sorters, tableProps } = useTable<Section>({
    syncWithLocation: true,
  });
  
  // Using the extracted filter handling hook
  const { getFilterValue, handleFilter, handleRemoveFilter } = useFilterHandling({
    filters,
    setFilters,
  });

  const sectionTypeOptions = [
    { label: "Hero Slider", value: SectionEnum.HeroSlider },
    { label: "Top Chart", value: SectionEnum.TopChart },
    { label: "Most Trending", value: SectionEnum.MostTrending },
    { label: "Continue Watching", value: SectionEnum.ContinueWatching },
    { label: "Most Popular", value: SectionEnum.MostPopular },
  ];

  return (
    <List>
      <FilterContainer>
        <FilterInput
          field="title"
          label="Title"
          onApply={handleFilter}
          onRemove={() => { handleRemoveFilter("title"); }}
          type="text"
          value={getFilterValue("title")}
        />
        <FilterInput
          field="type"
          label="Section Type"
          onApply={handleFilter}
          onRemove={() => { handleRemoveFilter("type"); }}
          options={sectionTypeOptions}
          type="multi-select"
          value={getFilterValue("type")}
        />
      </FilterContainer>

      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="title"
          defaultSortOrder={getDefaultSortOrder("title", sorters)}
          sorter
          title="Title"
        />
        <Table.Column
          dataIndex="type"
          render={(value: SectionEnumType) => (
            <Tag color={sectionTypeColors[value]}>{value}</Tag>
          )}
          sorter
          title="Type"
        />
        <Table.Column
          dataIndex="design"
          render={(value: string) => (
            value ? (
              <Image
                alt="Section Design"
                fallback="https://placehold.co/100x70?text=No+Design"
                height={70}
                src={value}
                style={{ objectFit: "cover" }}
                width={100}
              />
            ) : (
              <div style={{ 
                alignItems: "center", 
                background: "#f5f5f5", 
                color: "#999", 
                display: "flex", 
                fontSize: "12px", 
                height: 70,
                justifyContent: "center",
                width: 100
              }}>
                No Design
              </div>
            )
          )}
          title="Design"
        />
        <Table.Column
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <EditButton hideText recordItemId={record.id} size="small" />
              <ShowButton hideText recordItemId={record.id} size="small" />
              <DeleteButton hideText recordItemId={record.id} size="small" />
            </Space>
          )}
          title="Actions"
        />
      </Table>
    </List>
  );
};