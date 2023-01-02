import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ParsedUrlQuery } from "querystring";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const SinglePage: NextPage<Props> = ({ post }) => {
  const { content, title } = post;
  return (
    <div>
      <h1>{title}</h1>
      <MDXRemote {...content} />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  //reading paths
  const dirPathToRead = path.join(process.cwd(), "posts");
  const dirs = fs.readdirSync(dirPathToRead);
  const paths = dirs.map((filename) => {
    const filePathToRead = path.join(process.cwd(), "posts/" + filename);
    const fileContent = fs.readFileSync(filePathToRead, { encoding: "utf-8" });
    return {
      params: {
        postSlug: matter(fileContent).data.slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};
interface IStaticProps extends ParsedUrlQuery {
  postSlug: string;
}
type Post = {
  post: {
    title: string;
    content: MDXRemoteSerializeResult;
  };
};

export const getStaticProps: GetStaticProps<Post> = async (context) => {
  const { params } = context;
  const { postSlug } = params as IStaticProps;
  const filePathToRead = path.join(process.cwd(), "posts/" + postSlug + ".md");
  const fileContent = fs.readFileSync(filePathToRead, { encoding: "utf-8" });
  const { content, data } = matter(fileContent);
  const source = await serialize(content);
  return {
    props: {
      post: {
        content: source,
        title: data.title,
      },
    },
  };
};

export default SinglePage;
