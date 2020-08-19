import React from "react";
import PropTypes from "prop-types";

import styles from "./FileIndexHolder.module.scss";

import fileLogo from "../../assets/images/file.png";
import editLogo from "../../assets/images/edit.png";
import delLogo from "../../assets/images/delete.png";

import Button from "../UI/Button/Button";

const FileIndexHolder = (props) => {
  const attachedclasses = [styles.fileIndex];

  const { listName, edit, onDelete, index, clicked } = props;

  return (
    <div className={attachedclasses.join(" ")}>
      <div className={styles.nameHolder}>
        <img src={fileLogo} alt="file" />
        <div role="button" tabIndex={index} onClick={clicked}>
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

FileIndexHolder.propTypes = {
  clicked: PropTypes.func.isRequired,
  listName: PropTypes.string.isRequired,
  edit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};
