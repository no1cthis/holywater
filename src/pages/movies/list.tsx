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

import type { Movie } from "../../common/types";
import { FilterContainer, FilterInput } from "../../components/filters/filter-input";
import { useFilterHandling } from "../../hooks/use-filter-handling";

export const MovieList: React.FC = () => {
  const { filters, setFilters, sorters, tableProps } = useTable<Movie>({
    syncWithLocation: true,
  });

  console.log(tableProps.dataSource)

  // Using the extracted filter handling hook
  const { getFilterValue, handleFilter, handleRemoveFilter } = useFilterHandling({
    filters,
    setFilters,
  });

  const tagOptions = [
    { label: "Action", value: "Action" },
    { label: "Comedy", value: "Comedy" },
    { label: "Drama", value: "Drama" },
    { label: "Sci-Fi", value: "Sci-Fi" },
    { label: "Horror", value: "Horror" },
    { label: "Romance", value: "Romance" },
    { label: "Thriller", value: "Thriller" },
    { label: "Animation", value: "Animation" },
  ];

  return (
    <List>
      <FilterContainer>
        <FilterInput
          field="title"
          label="Title"
          onApply={handleFilter}
          onRemove={() => { handleRemoveFilter("title"); }}
          operator="contains"
          type="text"
          value={getFilterValue("title") as string}
        />
        <FilterInput
          field="tags"
          label="Tags"
          onApply={handleFilter}
          onRemove={() => { handleRemoveFilter("tags"); }}
          operator="in"
          options={tagOptions}
          type="multi-select"
          value={getFilterValue("tags")}
        />
      </FilterContainer>

      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="title"
          defaultSortOrder={getDefaultSortOrder("title", sorters)}
          sorter={{ multiple: 2 }}
          title="Title"
        />
        <Table.Column
          dataIndex="poster"
          render={(value: string) => (
            <Image
              alt="Movie Poster"
              fallback="https://via.placeholder.com/100x150?text=No+Image"
              height={100}
              src={value}
              style={{ objectFit: "contain" }}
            />
          )}
          title="Poster"
        />
        <Table.Column
          dataIndex="tags"
          render={(tags: string[]) =>
            tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
          }
          title="Tags"
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