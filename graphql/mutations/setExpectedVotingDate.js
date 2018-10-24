import gql from "graphql-tag";

export default gql`
  mutation setExpectedVotingDate(
    $procedureId: String!, $expectedVotingDate: Date!
  ) {
    setExpectedVotingDate(
      procedureId: $procedureId
      expectedVotingDate: $expectedVotingDate
    ) {
      procedureId
      customData {
        expectedVotingDate
      }
    }
  }
`;
