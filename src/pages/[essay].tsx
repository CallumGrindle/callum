import { GetStaticProps, GetStaticPaths } from "next";
import { remark } from "remark";
import html from "remark-html";
import fs from "fs";
import path from "path";
import { ParsedUrlQuery } from "querystring";

interface EssayProps {
  contentHtml: string;
}

interface EssayParams extends ParsedUrlQuery {
  essay: string;
}

export default function Essay({ contentHtml }: EssayProps) {
  return <div dangerouslySetInnerHTML={{ __html: contentHtml }} />;
}

export const getStaticPaths: GetStaticPaths<EssayParams> = async () => {
  const essaysDirectory = path.join(process.cwd(), "essays");
  const filenames = fs.readdirSync(essaysDirectory);
  const essayNames = filenames.map((filename) => filename.replace(/\.md$/, ""));
  const paths = essayNames.map((essayName) => ({
    params: { essay: essayName },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<EssayProps, EssayParams> = async ({
  params,
}) => {
  const essayPath = path.join(process.cwd(), "essays", `${params?.essay}.md`);

  const fileContents = fs.readFileSync(essayPath, "utf8");

  const contentHtml = await (
    await remark().use(html).process(fileContents)
  ).value;

  return {
    props: {
      contentHtml,
    },
  };
};
