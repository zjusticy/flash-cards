import { useState } from "react";
import * as React from "react";
import { useNavigate } from "react-router-dom";

import useGetLists from "features/file-list/use-file-list";
import useGetLocalLists from "features/file-list/use-local-file-list";
import Button from "features/ui/button/button";
import FileHolder from "features/file-list/file-index-holder/file-index-holder";
import Modal from "features/ui/modal/modal";
import InputCombine from "features/ui/input-combine/input-combine";
import styles from "./intro.module.scss";

const Intro = ({ localDB = false }: { localDB?: boolean }) => {
  const [listName, setName] = useState<string>("");

  const [modalShow, flipModal] = useState<boolean>(false);

  const [selectedName, setSelectedName] = useState<string>("");

  // const { useLocalDB } = useGlobalContext();

  const { cardLists, delelteList, addList } = useGetLists();

  const {
    fileList,
    error,
    actionError,
    delelteList: deleteLocalList,
    addList: addLocalList,
  } = useGetLocalLists();

  const navigate = useNavigate();

  const onClickedHandler = (_listName: string) => {
    if (localDB) {
      navigate(`/local/memoryBoard/${_listName}`);
      return;
    }
    navigate(`/memoryBoard/${_listName}`);
  };

  const onEditHandler = (_listName: string) => {
    if (localDB) {
      navigate(`/local/cardCreator/${_listName}`);
      return;
    }
    navigate(`/cardCreator/${_listName}`);
  };

  const myFileList = localDB ? fileList : cardLists;

  // const onLinkClicked = (event: React.MouseEvent) => {
  //   if (
  //     listName.trim() === "" ||
  //     (cardLists && cardLists.indexOf(listName) !== -1)
  //   ) {
  //     event.preventDefault();
  //   }
  // };

  const inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <>
      <Modal show={modalShow} modalClosed={() => flipModal(false)}>
        <div className={styles.removeButtonWrapper}>
          <Button
            btnType="Success"
            size="Big"
            debounced
            clicked={() => {
              if (localDB) {
                deleteLocalList(selectedName);
              } else {
                delelteList(selectedName);
              }
              flipModal(false);
            }}
            elementType="normal"
          >
            DELETE
          </Button>
          <Button
            btnType="Success"
            size="Big"
            clicked={() => flipModal(false)}
            elementType="normal"
          >
            CANCEL
          </Button>
        </div>
      </Modal>
      <div className={styles.introWrap}>
        <div className={styles.intro}>
          <div className={styles.createNewWrap}>
            <InputCombine
              name="name"
              tag="Name"
              listName={listName}
              inputChangedHandler={inputChangedHandler}
            />

            <Button
              btnType="Success"
              size="Big"
              clicked={() => {
                if (localDB) {
                  addLocalList(listName);
                  return;
                }
                addList(listName);
              }}
              elementType="normal"
              debounced
            >
              {/* <Link to={`/cardCreator/${listName}`} onClick={onLinkClicked}>
                +
              </Link> */}
              +
            </Button>
          </div>

          <div className={styles.listsWrap}>
            <h2>Lists</h2>
            {myFileList &&
              myFileList.map((list, index) => (
                <FileHolder
                  key={list}
                  index={index}
                  listName={list}
                  clicked={() => onClickedHandler(list)}
                  edit={() => onEditHandler(list)}
                  onDelete={() => {
                    flipModal((prev) => !prev);
                    setSelectedName(list);
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Intro;
