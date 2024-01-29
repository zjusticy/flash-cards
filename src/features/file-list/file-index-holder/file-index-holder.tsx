import Button from "@/features/ui/button/button";
import Link from "next/link";

type Props = {
  listName: string;
  edit: () => void;
  onDelete: () => void;
  // clicked: () => void;
  index: number;
  localDB: boolean;
};

const FileIndexHolder = ({
  listName,
  edit,
  onDelete,
  index,
  // clicked,
  localDB,
}: Props) => {
  return (
    <div className="flex justify-between h-[66px] w-full">
      <div className="nameHolder">
        <img src="/images/file.png" alt="file" />
        <Link
          href={
            localDB
              ? `/local/memoryBoard/${listName}`
              : `/memoryBoard/${listName}`
          }
        >
          <div
            // role="button"
            tabIndex={index}
            // onClick={clicked}
            onKeyDown={() => {}}
          >
            <span>{listName}</span>
          </div>
        </Link>
      </div>
      <div className="flex items-center mr-[6px]">
        <Button
          btnType="FileM"
          disabled={false}
          clicked={edit}
          elementType="normal"
          className="px-[6px] hover:bg-[rgba(0, 0, 0, 0.1)]"
        >
          <img src="/images/edit.png" alt="edit" />
        </Button>
        <Button
          btnType="FileM"
          disabled={false}
          clicked={onDelete}
          elementType="normal"
          className="px-[6px] hover:bg-[rgba(0, 0, 0, 0.1)]"
        >
          <img src="/images/delete.png" alt="delete" />
        </Button>
      </div>
    </div>
  );
};

export default FileIndexHolder;
