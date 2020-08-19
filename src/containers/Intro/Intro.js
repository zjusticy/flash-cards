import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "./Intro.module.scss";
import Button from "../../components/UI/Button/Button";
import FileHolder from "../../components/FileIndexHolder/FileIndexHolder";
import InputCombine from "../../components/UI/InputCombine/InputCombine";
import Modal from "../../components/UI/Modal/Modal";
import Layout from "../../hoc/Layout/Layout";
import useCards from "../../hooks/useCards";

const Intro = () => {
  const [listName, setName] = useState("");

  const [modalShow, flipModal] = useState(false);

  const [selectedName, setSelectedName] = useState("");

  const { onDelList, onGetLists, onAddList, listNames } = useCards();

  const history = useHistory();

  useEffect(() => {
    onGetLists && onGetLists();
  }, [onGetLists]);

  const _onClickedHandler = (_listName) => {
    history.push(`/memoryBoard/${_listName}`);
  };

  const _onEditHandler = (_listName) => {
    history.push(`/cardCreator/${_listName}`);
  };

  const _onDeleteHandler = (_listName) => {
    const newLists = listNames.filter((list) => list !== _listName);
    localStorage.setItem("lists", JSON.stringify(newLists));
    localStorage.removeItem(`memoryBoard${_listName}`);
    onDelList && onDelList(_listName, newLists);
  };

  const _onAddHandler = () => {
    if (listNames.indexOf(listName) !== -1) {
      // console.log("Exist");
      return;
    }
    if (listName.trim() === "") {
      // console.log("Can't be empty");
      return;
    }
    localStorage.setItem("lists", JSON.stringify([listName, ...listNames]));

    onAddList && onAddList(listName, +new Date());
  };

  const _onLinkClicked = (event) => {
    if (listName.trim() === "" || listNames.indexOf(listName) !== -1) {
      event.preventDefault();
    }
  };

  const _inputChangedHandler = (event) => {
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
              _onDeleteHandler(selectedName);
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
              inputChangedHandler={_inputChangedHandler}
            />

            <Button
              btnType="Success"
              size="Big"
              clicked={_onAddHandler}
              elementType="normal"
            >
              <Link to={`/cardCreator/${listName}`} onClick={_onLinkClicked}>
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
                clicked={() => _onClickedHandler(list)}
                edit={() => _onEditHandler(list)}
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
