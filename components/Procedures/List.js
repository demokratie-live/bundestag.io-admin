import React, { Component } from "react";
import { graphql } from "react-apollo";
import { List, Icon, Spin } from "antd";
import Link from "next/link";

import InfiniteScroll from "react-infinite-scroller";

import PROCEDURE_LIST from "../../graphql/queries/procedureList";

const PAGE_SIZE = 20;

const IconText = ({ type, text }) => (
  <span style={{ filter: "blur(2px)" }}>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

class ProcedureList extends Component {
  state = {
    hasMore: true
  };

  loadedRowsMap = {};

  isRowLoaded = ({ index }) => {
    return !!this.loadedRowsMap[index];
  };

  renderItem = ({ title, procedureId }) => {
    return (
      <List.Item key={procedureId}>
        <List.Item.Meta
          title={
            <Link as={`/procedure/${procedureId}`} href={`/procedure?id=${procedureId}`}><a
              style={{
                width: 500,
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                display: "inline-block",
                overflow: "hidden"
              }}
            >
              {title}
            </a></Link>
          }
        />
        <div>Content</div>
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
