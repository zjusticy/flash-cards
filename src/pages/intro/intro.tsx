import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useGetLists from "@/features/file-list/use-file-list";
import useGetLocalLists from "@/features/file-list/use-local-file-list";
import Button from "@/features/ui/button/button";
import FileHolder from "@/features/file-list/file-index-holder/file-index-holder";
import Modal from "@/features/ui/modal/modal";
import InputCombine from "@/features/ui/input-combine/input-combine";

const Intro = ({ localDB = false }: { localDB?: boolean }) => {
  const [listName, setName] = useState<string>("");

  const [modalShow, flipModal] = useState<boolean>(false);

  const [selectedName, setSelectedName] = useState<string>("");

  const { cardLists, delelteList, addList } = useGetLists();

  const navigate = useNavigate();

  const {
    fileList,
    // error,
    // actionError,
    delelteList: deleteLocalList,
    addList: addLocalList,
  } = useGetLocalLists();

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

  const inputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <>
      <Modal show={modalShow} modalClosed={() => flipModal(false)}>
        <div className="flex justify-around">
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
      <div className="flex h-full w-full flex-auto justify-center items-center">
        <div className="w-full max-w-[700px] flex flex-col relative h-[550px]">
          <div className="flex justify-between mb-[36px] flex-grow-0 flex-shrink-0">
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
              +
            </Button>
          </div>

          <div className="border-[2px] border-solid border-gray-300 min-h-20 overflow-auto flex-grow">
            <h2
              className="absolute mt-[-1.25rem] ml-4 bg-[#ffffff] h-5 p-1 \
             text-[#b9b9b9] text-[1rem] font-pressStart [&+div]:mt-4"
            >
              Lists
            </h2>
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
