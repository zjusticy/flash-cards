import { useState, useEffect } from "react";
import * as React from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "./Intro.module.scss";
import Button from "../../components/UI/Button/Button";
import FileHolder from "../../components/FileIndexHolder/FileIndexHolder";
import InputCombine from "../../components/UI/InputCombine/InputCombine";
import Modal from "../../components/UI/Modal/Modal";
import Layout from "../../hoc/Layout/Layout";
import useCards from "../../hooks/useCards";

const Intro = () => {
  const [listName, setName] = useState<string>("");

  const [modalShow, flipModal] = useState<boolean>(false);

  const [selectedName, setSelectedName] = useState<string>("");

  const { onDelList, onGetLists, onAddList, listNames } = useCards();

  const history = useHistory();

  useEffect(() => {
    if (onGetLists) onGetLists();
  }, [onGetLists]);

  const onClickedHandler = (_listName: string) => {
    history.push(`/memoryBoard/${_listName}`);
  };

  const onEditHandler = (_listName: string) => {
    history.push(`/cardCreator/${_listName}`);
  };

  const onDeleteHandler = (_listName: string) => {
    const newLists = listNames.filter((list) => list !== _listName);
    localStorage.setItem("lists", JSON.stringify(newLists));
    localStorage.removeItem(`memoryBoard${_listName}`);
    if (onDelList) onDelList(_listName, newLists);
  };

  const onAddHandler = () => {
    if (listNames.indexOf(listName) !== -1) {
      // console.log("Exist");
      return;
    }
    if (listName.trim() === "") {
      // console.log("Can't be empty");
      return;
    }
    localStorage.setItem("lists", JSON.stringify([listName, ...listNames]));

    if (onAddList) onAddList(listName, (+new Date()).toString());
  };

  const onLinkClicked = (event: React.MouseEvent) => {
    if (listName.trim() === "" || listNames.indexOf(listName) !== -1) {
      event.preventDefault();
    }
  };

  const inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <Layout home>
      <Modal show={modalShow} modalClosed={() => flipModal(false)}>
        <div className={styles.removeButtonWrapper}>
          <Button
            btnType="Success"
            size="Big"
            clicked={() => {
              onDeleteHandler(selectedName);
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
              clicked={onAddHandler}
              elementType="normal"
            >
              <Link to={`/cardCreator/${listName}`} onClick={onLinkClicked}>
                ADD LIST
              </Link>
            </Button>
          </div>

          <div className={styles.listsWrap}>
            <h2>Lists</h2>

            {listNames.map((list, index) => (
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
    </Layout>
  );
};

export default Intro;
