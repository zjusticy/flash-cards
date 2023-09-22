import * as React from "react";

import Button from "features/ui/button/button";
import fileLogo from "assets/images/file.png";
import editLogo from "assets/images/edit.png";
import delLogo from "assets/images/delete.png";

import styles from "./file-index-holder.module.scss";

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
  const attachedclasses = [styles.fileIndex];

  return (
    <div className={attachedclasses.join(" ")}>
      <div className={styles.nameHolder}>
        <img src={fileLogo} alt="file" />
        <div
          role="button"
          tabIndex={index}
          onClick={clicked}
          onKeyDown={() => {}}
        >
          <span>{listName}</span>
        </div>
      </div>
      <div className={styles.buttonHolder}>
        <Button
          btnType="FileM"
          disabled={false}
          clicked={edit}
          elementType="normal"
        >
          <img src={editLogo} alt="edit" />
        </Button>
        <Button
          btnType="FileM"
          disabled={false}
          clicked={onDelete}
          elementType="normal"
        >
          <img src={delLogo} alt="delete" />
        </Button>
      </div>
    </div>
  );
};

export default FileIndexHolder;
