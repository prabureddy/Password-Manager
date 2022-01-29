import React from "react";
import { IManagerItemPageProps } from "../types";

const ManagerItem = ({
  id,
  onClick,
  site,
  user,
  favicon,
}: IManagerItemPageProps) => {
  const handlerClickManager = () => {
    onClick(id);
  };
  return (
    <div className="manager-item" onClick={handlerClickManager}>
      {favicon && (
        <div className="favicon">
          <img src={favicon} />
        </div>
      )}
      <div className="content">
        {site && <p className="content-title">{site}</p>}
        {user && <p className="content-user">{user}</p>}
      </div>
      <div className="fill">
        <p>Fill</p>
      </div>
    </div>
  );
};

export default ManagerItem;
