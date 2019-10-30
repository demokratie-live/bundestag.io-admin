import gql from "graphql-tag";
import VoteResults from "../fragments/voteResults";

const proceduresQuery = gql`
  query procedures($manageVoteDate: Boolean, $limit: Int, $offset: Int) {
    procedures(manageVoteDate: $manageVoteDate, limit: $limit, offset: $offset) {
      procedureId
      title
      type
      period
      currentStatus
      namedVote
      bioUpdateAt
      importantDocuments {
        type
        editor
        number
        url
      }
      history {
        assignment
        initiator
        findSpot
        findSpotUrl
        decision {
          type
        }
      }
      ...VoteResults
    }
  }
  ${VoteResults}
`;

export default proceduresQuery;
