import styled from "styled-components";
import Router, { withRouter } from "next/router";
import { Layout, Menu, Icon } from "antd";
import Link from "next/link";

const { Header, Sider } = Layout;

// import Link from "./Link";

const Wrapper = styled.header`
  margin-bottom: 25px;
`;

const Navigation = ({ router: { pathname } }) => (
  <Sider
    breakpoint="lg"
    collapsedWidth="0"
    onCollapse={(collapsed, type) => {
      console.log(collapsed, type);
    }}
  >
    <div className="logo" />
    <Menu theme="dark" mode="inline" defaultSelectedKeys={[pathname]}>
      <Menu.Item key="/">
        <Link prefetch href="/">
          <a>
            <Icon type="user" />
            <span className="nav-text">Home</span>
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="/procedures">
        <Link prefetch href="/procedures">
          <a>
            <Icon type="pie-chart" />
            <span className="nav-text">Vorgänge</span>
          </a>
        </Link>
        <Icon type="video-camera" />
      </Menu.Item>
    </Menu>
  </Sider>
);

export default withRouter(Navigation);
