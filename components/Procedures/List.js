import React, { Component } from "react";
import { graphql } from "react-apollo";
import { List, Icon, Spin, Divider, Checkbox } from "antd";
import Link from "next/link";

import InfiniteScroll from "react-infinite-scroller";

import PROCEDURE_LIST from "../../graphql/queries/procedureList";

const PAGE_SIZE = 20;

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
    customData: { voteResults, possibleVotingDate }
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
    if (possibleVotingDate) {
      icons.push(<Icon key={"thunderbolt"} type="thunderbolt" theme="twoTone" twoToneColor="#eb2f96" />);
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
              <a>{procedureId} – {title}</a>
            </Link>
          }
          description={<>{icons.map(icon => icon)}</>}
        />
      </List.Item>
    );
  };

  fetchMore = () => {
    this.props.fetchMore().then(({ data, data: { procedures } }) => {
      if (procedures.length === 0) {
        this.setState({ hasMore: false });
      }
    });
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
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.fetchMore}
          hasMore={!loadingProcedures && this.state.hasMore}
          useWindow={true}
        >
          <List dataSource={procedures} renderItem={this.renderItem}>
            {loadingProcedures &&
              this.state.hasMore && (
                <div className="demo-loading-container">
                  <Spin />
                </div>
              )}
          </List>
        </InfiniteScroll>
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
  props: ({ data, data: { procedures, loading, fetchMore } }, props) => {
    return {
      procedures: procedures || [],
      loadingProcedures: loading,
      fetchMore: () => {
        if (loading) {
          return;
        }

        return fetchMore({
          fetchPolicy: "network-only",
          variables: {
            limit: PAGE_SIZE,
            offset: procedures.length,
            manageVoteDate: true
          },
          notifyOnNetworkStatusChange: true,
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            return Object.assign({}, prev, {
              procedures: [...prev.procedures, ...fetchMoreResult.procedures]
            });
          }
        });
      }
    };
  }
})(ProcedureList);
