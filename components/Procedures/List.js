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
  state = {
    hasMore: true,
    onlyWithoutVoteData: false
  };

  loadedRowsMap = {};

  isRowLoaded = ({ index }) => {
    return !!this.loadedRowsMap[index];
  };

  renderItem = ({
    title,
    procedureId,
    namedVote,
    customData: { voteResults }
  }) => {
    let icons = [];
    if (voteResults.yes > 0 || voteResults.no > 0) {
      icons.push(<Icon type="pie-chart" />);
    }
    if (namedVote) {
      icons.push(<Icon type="idcard" />);
    }
    icons = icons
      .reduce((prev, icon) => [...prev, icon, <Divider type="vertical" />], [])
      .slice(0, -1);

    if (
      this.state.onlyWithoutVoteData &&
      (voteResults.yes > 0 || voteResults.no > 0)
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
              <a>{title}</a>
            </Link>
          }
          description={<>{icons.map(icon => icon)}</>}
        />
      </List.Item>
    );
  };

  fetchMore = () => {
    this.props.fetchMore().then(({ data, data: { procedures } }) => {
      console.log(data);
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
          onChange={({ target: { checked } }) =>
            this.setState({ onlyWithoutVoteData: checked })
          }
          value={this.state.onlyWithoutVoteData}
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
      voteDate: true,
      limit: PAGE_SIZE
    },
    notifyOnNetworkStatusChange: true
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
            voteDate: true
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
