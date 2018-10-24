import gql from "graphql-tag";

export default gql`
  fragment VoteResults on Procedure {
    customData {
      possibleVotingDate
      expectedVotingDate
      voteResults {
        yes
        no
        abstination
        decisionText
        votingDocument
        partyVotes {
          party
          main
          deviants {
            yes
            abstination
            no
          }
        }
      }
    }
  }
`;
