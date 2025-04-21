import {
  DeleteButton,
  EditButton,
  getDefaultSortOrder,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, Tag } from "antd";
import React from "react";

import type { ScreenConfiguration } from "../../common/types";
import { SetActiveButton } from "../../components/buttons/set-active-button";
import { FilterContainer, FilterInput } from "../../components/filters/filter-input";
import { useActiveConfig } from "../../hooks/use-active-config";
import { useFilterHandling } from "../../hooks/use-filter-handling";

export const ScreenConfigurationList: React.FC = () => {
  const { filters, setFilters, sorters, tableProps } = useTable<ScreenConfiguration>({
    syncWithLocation: true,
  });
  
  const { activeConfigId, changeActiveConfig } = useActiveConfig();
  
  // Using the extracted filter handling hook
  const { getFilterValue, handleFilter, handleRemoveFilter } = useFilterHandling({
    filters,
    setFilters,
  });

  return (
    <List>
      <FilterContainer>
        <FilterInput
          field="name"
          label="Name"
          onApply={handleFilter}
          onRemove={() => { handleRemoveFilter("name"); }}
          type="text"
          value={getFilterValue("name")}
        />
      </FilterContainer>

      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="name"
          defaultSortOrder={getDefaultSortOrder("name", sorters)}
          sorter
          title="Name"
        />
        <Table.Column
          dataIndex="description"
          render={(value: string) => 
            value ? (value.length > 50 ? `${value.substring(0, 50)}...` : value) : "-"
          }
          title="Description"
        />
        <Table.Column
          dataIndex="id"
          render={(id: string) => {
            const isActive = id === activeConfigId;
            return isActive ? <Tag color="green">Active</Tag> : null;
          }}
          title="Active"
        />
        <Table.Column
          dataIndex="actions"
          render={(_, record: BaseRecord) => {
            const isActive = record.id === activeConfigId;
            return (
              <Space>
                <EditButton hideText recordItemId={record.id} size="small" />
                <ShowButton hideText recordItemId={record.id} size="small" />
                <DeleteButton hideText recordItemId={record.id} size="small" />
                <SetActiveButton 
                  disabled={isActive} 
                  hideText 
                  onSuccess={changeActiveConfig} 
                  recordItemId={record.id}
                  size="small"
                />
              </Space>
            );
          }}
          title="Actions"
        />
      </Table>
    </List>
  );
};