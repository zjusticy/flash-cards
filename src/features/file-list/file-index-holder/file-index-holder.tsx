import Button from "@/features/ui/button/button";
import { FileIcon, EditIcon, DeleteIcon } from "@/assets/images";

type Props = {
  listName: string;
  edit: () => void;
  onDelete: () => void;
  clicked: () => void;
  index: number;
};

const FileIndexHolder = ({
  listName,
  edit,
  onDelete,
  index,
  clicked,
}: Props) => {
  return (
    <div className="flex justify-between h-[66px] w-full">
      <div className="nameHolder">
        <FileIcon alt="file" className="h-8 w-8" />
        <div
          role="button"
          tabIndex={index}
          onClick={clicked}
          onKeyDown={() => {}}
        >
          <span>{listName}</span>
        </div>
      </div>
      <div className="flex items-center mr-[6px]">
        <Button
          btnType="FileM"
          disabled={false}
          clicked={edit}
          elementType="normal"
          className="p-[6px] hover:bg-gray-200"
        >
          <EditIcon alt="edit" className="h-8 w-8" />
        </Button>
        <Button
          btnType="FileM"
          disabled={false}
          clicked={onDelete}
          elementType="normal"
          className="p-[6px] hover:bg-gray-200"
        >
          <DeleteIcon alt="delete" className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default FileIndexHolder;
