// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Manager, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type IError = {
  error: string;
};

const getManager = async (
  req: NextApiRequest,
  res: NextApiResponse<Manager[] | IError>
) => {
  try {
    if (!req.query.site) {
      return res.status(404).json({ error: "Site query not found" });
    }
    const managers: Manager[] = await prisma.manager.findMany({
      where: {
        AND: {
          site: String(req.query.site),
        },
      },
    });
    return res.status(200).json(managers);
  } catch (error: any) {
    return res.status(400).json({ error: error || "Something went wrong!" });
  }
};

const postManager = async (
  req: NextApiRequest,
  res: NextApiResponse<Manager | IError>
) => {
  try {
    if (typeof req.body !== "string") {
      throw new Error("Body must be an string");
    }
    const savedPassword: Manager = await prisma.manager.create({
      data: JSON.parse(req.body),
    });
    return res.status(201).json(savedPassword);
  } catch (error: any) {
    return res
      .status(400)
      .json({ error: error.message || "Something went wrong!" });
  }
};

const putManager = async (
  req: NextApiRequest,
  res: NextApiResponse<Manager | IError>
) => {
  try {
    if (!req.query.id) {
      return res.status(404).json({ error: "Id not found" });
    }
    if (typeof req.body !== "string") {
      throw new Error("Body must be an string");
    }
    const savedPassword: Manager = await prisma.manager.update({
      where: { id: String(req.query.id) },
      data: JSON.parse(req.body),
    });
    res.status(202).json(savedPassword);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || "Something went wrong!" });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      getManager(req, res);
      break;
    case "POST":
      postManager(req, res);
      break;
    case "PUT":
      putManager(req, res);
      break;

    default:
      break;
  }
}
