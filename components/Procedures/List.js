import React, { Component } from "react";
import { graphql } from "react-apollo";
import { List, Icon, Spin, Divider, Checkbox, Table } from "antd";
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

const columns = [
  {
    title: "ID",
    dataIndex: "procedureId",
    sorter: (a, b) => a.procedureId - b.procedureId,
    width: "100px"
  },
  {
    title: "Status",
    dataIndex: "currentStatus",
    // sorter: (a, b) => a.currentStatus.localeCompare(b.currentStatus),
    width: "200px"
  },
  {
    title: "Title",
    dataIndex: "title",
    sorter: (a, b) => a.title.localeCompare(b.title)
  },
  {
    title: "Named",
    key: "named",
    width: "100px",
    filters: [
      {
        text: 'Named',
        value: "true",
      },
      {
        text: 'not Named',
        value: "false",
      },
    ],
    filterMultiple: false,
    onFilter: (value, {namedVote}) => value === "true" && namedVote || value === "false" && !namedVote,
    render: ({ namedVote }) => (
      <>{namedVote && <Icon key={"idcard"} type="idcard" />}</>
    )
  }
];

class ProcedureList extends Component {
  static onlyWithoutVoteData = false;
  state = {
    hasMore: true,
    onlyWithoutVoteData: ProcedureList.onlyWithoutVoteData
  };

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
        <Table columns={columns} dataSource={procedures} />
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
