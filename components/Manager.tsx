import { IManagerItemPageProps } from "../types";
import { TiTick } from "react-icons/ti";

const ManagerItem = ({
  id,
  onClick,
  site,
  user,
  favicon,
  selected,
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
        {selected ? <TiTick style={{ width: 24, height: 24 }} /> : <p>Fill</p>}
      </div>
    </div>
  );
};

export default ManagerItem;
