import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";
import { Manager, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type GeneratePageProps = {
  managers: Partial<Manager>[];
};

const Generate = ({ managers = [] }: GeneratePageProps) => {
  return (
    <div className="flex h-full">
      {managers.map((manager) => (
        <div
          key={manager.id}
          className="flex justify-center items-center text-3xl font-bold underline"
        >
          <div>{manager.site}</div>
          <div>{manager.username}</div>
          <div>{manager.password}</div>
        </div>
      ))}
      {managers.length === 0 && (
        <div className="text-3xl font-bold underline">No Managers found</div>
      )}
    </div>
  );
};

export default Generate;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { site = "" } = context.query;
  let managers: Partial<Manager>[] = [];
  if (site) {
    managers = await prisma.manager.findMany({
      where: {
        AND: {
          site: String(site),
        },
      },
      select: {
        id: true,
        site: true,
        username: true,
        password: true,
      },
    });
  }
  return {
    props: {
      managers,
    },
  };
};
