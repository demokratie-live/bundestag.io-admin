import Layout from "../components/Layout";
import App from "../components/App";
import Submit from "../components/Submit";
import PostList from "../components/PostList";

export default () => (
  <Layout>
    <App>
      <Submit />
      <PostList />
    </App>
  </Layout>
);
