import { useState } from "react";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

import useGetLists from "features/file-list/use-file-list";
import Button from "features/ui/button/button";
import FileHolder from "features/file-list/file-index-holder/file-index-holder";
import Modal from "features/ui/modal/modal";
import InputCombine from "features/ui/input-combine/input-combine";
import styles from "./intro.module.scss";

const Intro = () => {
  const [listName, setName] = useState<string>("");

  const [modalShow, flipModal] = useState<boolean>(false);

  const [selectedName, setSelectedName] = useState<string>("");

  // const { onDelList } = useCards();

  const { cardLists, delelteList, addList } = useGetLists();

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (onGetLists) onGetLists();
  // }, [onGetLists]);

  const onClickedHandler = (_listName: string) => {
    navigate(`/memoryBoard/${_listName}`);
  };

  const onEditHandler = (_listName: string) => {
    navigate(`/cardCreator/${_listName}`);
  };

  // const onDeleteHandler = (_listName: string) => {
  //   if (cardLists) {
  //     const newLists = cardLists.filter((list) => list !== _listName);
  //     localStorage.setItem("lists", JSON.stringify(newLists));
  //     localStorage.removeItem(`memoryBoard${_listName}`);
  //     // if (onDelList) onDelList(_listName, newLists);
  //     removeList(_listName)?.then(() => {
  //       mutate();
  //     });
  //   }
  // };

  // const onAddHandler = () => {
  //   if (!cardLists || cardLists.indexOf(listName) !== -1) {
  //     // console.log("Exist");
  //     return;
  //   }
  //   if (listName.trim() === "") {
  //     // console.log("Can't be empty");
  //     return;
  //   }
  //   localStorage.setItem("lists", JSON.stringify([listName, ...cardLists]));

  //   if (addLists)
  //     addLists(listName, (+new Date()).toString())
  //       .then(() => {
  //         mutate();
  //       })
  //       .catch(() => {});
  // };

  const onLinkClicked = (event: React.MouseEvent) => {
    if (
      listName.trim() === "" ||
      (cardLists && cardLists.indexOf(listName) !== -1)
    ) {
      event.preventDefault();
    }
  };

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
              delelteList(selectedName);
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
              clicked={() => addList(listName)}
              elementType="normal"
              debounced
            >
              <Link to={`/cardCreator/${listName}`} onClick={onLinkClicked}>
                +
              </Link>
            </Button>
          </div>

          <div className={styles.listsWrap}>
            <h2>Lists</h2>

            {cardLists &&
              cardLists.map((list, index) => (
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
    // </Layout>
  );
};

export default Intro;
