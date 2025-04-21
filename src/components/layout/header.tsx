import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";

import { useGetIdentity } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Space,
  Switch,
  theme,
  Typography,
} from "antd";
import React, { useContext } from "react";

import { ColorModeContext } from "../../providers/color-mode-provider";

const { Text } = Typography;
const { useToken } = theme;

interface IUser {
  avatar: string;
  id: number;
  name: string;
}

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);

  const headerStyles: React.CSSProperties = {
    alignItems: "center",
    backgroundColor: token.colorBgElevated,
    display: "flex",
    height: "64px",
    justifyContent: "flex-end",
    padding: "0px 24px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Switch
          checkedChildren="🌛"
          defaultChecked={mode === "dark"}
          onChange={() => { setMode(mode === "light" ? "dark" : "light"); }}
          unCheckedChildren="🔆"
        />
        <Space size="middle" style={{ marginLeft: "8px" }}>
          {user?.name && <Text strong>{user.name}</Text>}
          {user?.avatar && <Avatar alt={user.name} src={user.avatar} />}
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};
