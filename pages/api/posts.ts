import { NextApiHandler } from "next";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
//Methods
//GET => when you need to just get or read the data.
//POST => when you want to send some fresh data
//PATCH => when you want to update some part or the data.
//PUT => when you want to replace the old data with new data.
//DELETE => when you want to delete data.

const handler: NextApiHandler = (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET":
      const data = readPostsInfo();
      return res.json({ postInfo: data });
    default:
      return res.status(404).send("Not Found");
  }
};
const readPostsInfo = () => {
  const dirPathToRead = path.join(process.cwd(), "posts");
  const dirs = fs.readdirSync(dirPathToRead);
  const data = dirs.map((filename) => {
    const filePathToRead = path.join(process.cwd(), "posts/" + filename);

    const fileContent = fs.readFileSync(filePathToRead, { encoding: "utf-8" });
    return matter(fileContent).data;
  });
  return data;
};
export default handler;
