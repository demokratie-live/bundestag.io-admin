import React, { Component } from "react";
import { graphql } from "react-apollo";
import {
  List,
  Icon,
  Spin,
  Divider,
  Checkbox,
  Table,
  Input,
  Button
} from "antd";
import Link from "next/link";

import InfiniteScroll from "react-infinite-scroller";

import PROCEDURE_LIST from "../../graphql/queries/procedureList";

const PAGE_SIZE = 10000;

const IconText = ({ type, text }) => (
  <span style={{ filter: "blur(0px)" }}>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class ProcedureList extends Component {
  static onlyWithoutVoteData = false;
  state = {
    hasMore: true,
    onlyWithoutVoteData: ProcedureList.onlyWithoutVoteData,
    searchText: ""
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    }
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  columns = [
    {
      title: "ID",
      dataIndex: "procedureId",
      name: "procedureId",
      sorter: (a, b) => a.procedureId - b.procedureId,
      width: "100px",
      ...this.getColumnSearchProps("procedureId")
    },
    {
      title: "Date",
      dataIndex: "bioUpdateAt",
      name: "bioUpdateAt",
      sorter: (a, b) => a.bioUpdateAt && a.bioUpdateAt.localeCompare(b.bioUpdateAt),
      width: "125px",
      render: (value) => value ? new Date(value).toLocaleString():''
    },
    {
      title: "Status",
      dataIndex: "currentStatus",
      width: "200px",
      filters: this.props.procedures.reduce(
        (prev, procedure) =>
          procedure.currentStatus &&
          !prev.some(({ value }) => value === procedure.currentStatus)
            ? [
                ...prev,
                {
                  text: procedure.currentStatus,
                  value: procedure.currentStatus
                }
              ]
            : prev,
        []
      ),
      onFilter: (value, { currentStatus }) => value === currentStatus
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      ...this.getColumnSearchProps("title"),
      render: (title, { procedureId }) => (
        <Link
          as={`/procedure/${procedureId}`}
          href={`/procedure?id=${procedureId}`}
        >
          <a>{title}</a>
        </Link>
      )
    },
    {
      title: "Named",
      key: "named",
      width: "100px",
      filters: [
        {
          text: "Named",
          value: "true"
        },
        {
          text: "not Named",
          value: "false"
        }
      ],
      filterMultiple: false,
      onFilter: (value, { namedVote }) =>
        (value === "true" && namedVote) || (value === "false" && !namedVote),
      render: ({ namedVote }) => (
        <>{namedVote && <Icon key={"idcard"} type="idcard" />}</>
      )
    },
    {
      title: "Daten",
      key: "data",
      width: "100px",
      filters: [
        {
          text: "mit Daten",
          value: "true"
        },
        {
          text: "ohne Daten",
          value: "false"
        }
      ],
      filterMultiple: false,
      onFilter: (value, { namedVote, customData: { voteResults } }) =>
        (value === "true" &&
          (namedVote ||
            (voteResults.yes > 0 ||
              voteResults.no > 0 ||
              voteResults.abstination > 0))) ||
        (value === "false" &&
          !(
            voteResults.yes > 0 ||
            voteResults.no > 0 ||
            voteResults.abstination > 0
          )),
      render: ({ namedVote, customData: { voteResults } }) =>
        (namedVote ||
          (voteResults.yes > 0 ||
            voteResults.no > 0 ||
            voteResults.abstination > 0)) && (
          <Icon key={"pie-chart"} type="pie-chart" />
        )
    }
  ];

  loadedRowsMap = {};

  isRowLoaded = ({ index }) => {
    return !!this.loadedRowsMap[index];
  };

  renderItem = ({
    title,
    procedureId,
    namedVote,
    customData: { voteResults, possibleVotingDate, expectedVotingDate },
    currentStatus
  }) => {
    let icons = [];
    if (
      voteResults.yes > 0 ||
      voteResults.no > 0 ||
      voteResults.abstination > 0
    ) {
      icons.push(<Icon key={"pie-chart"} type="pie-chart" />);
    }
    if (namedVote) {
      icons.push(<Icon key={"idcard"} type="idcard" />);
    }
    if (possibleVotingDate && !expectedVotingDate) {
      icons.push(
        <Icon
          key={"thunderbolt"}
          type="thunderbolt"
          theme="twoTone"
          twoToneColor={
            possibleVotingDate === expectedVotingDate ? "green" : "#eb2f96"
          }
        />
      );
    }
    icons = icons
      .reduce(
        (prev, icon, i) => [
          ...prev,
          icon,
          <Divider key={`divider-${i}`} type="vertical" />
        ],
        []
      )
      .slice(0, -1);

    if (
      this.state.onlyWithoutVoteData &&
      (voteResults.yes > 0 || voteResults.no > 0 || voteResults.abstination > 0)
    ) {
      return <></>;
    }

    return (
      <List.Item key={procedureId}>
        <List.Item.Meta
          title={
            <Link
              as={`/procedure/${procedureId}`}
              href={`/procedure?id=${procedureId}`}
            >
              <a>
                {procedureId} - {currentStatus} – {title}
              </a>
            </Link>
          }
          description={<>{icons.map(icon => icon)}</>}
        />
      </List.Item>
    );
  };

  render() {
    const { procedures, loadingProcedures } = this.props;

    return (
      <div>
        <Checkbox
          onChange={({ target: { checked } }) => {
            this.setState({ onlyWithoutVoteData: checked });
            ProcedureList.onlyWithoutVoteData = checked;
          }}
          checked={this.state.onlyWithoutVoteData}
        >
          ohne Abstimmungsdaten
        </Checkbox>
        <Table
          columns={this.columns}
          dataSource={procedures}
          rowKey={procedure => procedure.procedureId}
        />
        <List dataSource={procedures} renderItem={this.renderItem}>
          {loadingProcedures && this.state.hasMore && (
            <div className="demo-loading-container">
              <Spin />
            </div>
          )}
        </List>
      </div>
    );
  }
}

ProcedureList.defaultProps = {
  hasMore: true
};

export default graphql(PROCEDURE_LIST, {
  options: {
    variables: {
      manageVoteDate: true,
      limit: PAGE_SIZE
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network"
  },
  props: ({ data, data: { procedures, loading } }, props) => {
    return {
      procedures: procedures || [],
      loadingProcedures: loading
    };
  }
})(ProcedureList);
