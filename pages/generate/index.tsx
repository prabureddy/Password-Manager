import { useState } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Manager, PrismaClient } from "@prisma/client";
import { GeneratePageProps } from "../../types";
import ManagerItem from "../../components/Manager";

const prisma = new PrismaClient();

const Generate = ({ managers = [], favIconURL = "" }: GeneratePageProps) => {
  const [selectedItem, setSelectedItem] = useState("");
  const handlerOnClickManager = (id: string) => {
    setSelectedItem(id);
    window.parent.postMessage(
      {
        TYPE: "MANAGER_CLICK",
        data: {
          manager: managers.find((manager) => manager.id === id),
        },
      },
      "*"
    );
  };
  return (
    <div className="container">
      <div className="managers-container">
        {managers.map((manager) => (
          <ManagerItem
            key={manager.id}
            id={manager.id as string}
            site={manager.site as string}
            user={manager.username as string}
            favicon={favIconURL}
            selected={selectedItem === manager.id}
            onClick={handlerOnClickManager}
          />
        ))}
        {managers.length === 0 && (
          <div className="no-managers">No saved passwords found</div>
        )}
      </div>
    </div>
  );
};

export default Generate;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { site = "", favIconURL = "" } = context.query;
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
      favIconURL: decodeURIComponent(favIconURL as string),
    },
  };
};
