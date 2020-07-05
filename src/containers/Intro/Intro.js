import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { connect } from "react-redux";
import PropTypes from "prop-types";

import styles from "./Intro.module.scss";
import Button from "../../components/UI/Button/Button";
import FileHolder from "../../components/FileIndexHolder/FileIndexHolder";
import InputCombine from "../../components/UI/InputCombine/InputCombine";
import { deleteList, getLists, onAddList } from "../../store/cards";
// import Input from '../../components/UI/Input/Input';
import Layout from "../../hoc/Layout/Layout";

class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listName: "",
    };
  }

  componentDidMount() {
    this._loadLists();
  }

  _loadLists = () => {
    this.props.onGetLists && this.props.onGetLists();
  };

  _onClickedHandler = (listName) => {
    this.props.history.push(`/memoryBoard/${listName}`);
  };

  _onEditHandler = (listName) => {
    this.props.history.push(`/cardCreator/${listName}`);
  };

  _onDeleteHandler = (listName) => {
    const newLists = this.props.listNames.filter((list) => list !== listName);
    // this.setState({listName:  newLists });
    localStorage.setItem("lists", JSON.stringify(newLists));
    // localStorage.removeItem(listName);
    localStorage.removeItem(`memoryBoard${listName}`);
    this.props.onDelList && this.props.onDelList(listName, newLists);
  };

  _onAddHandler = () => {
    if (this.props.listNames.indexOf(this.state.listName) !== -1) {
      // console.log("Exist");
      return;
    }
    if (this.state.listName.trim() === "") {
      // console.log("Can't be empty");
      return;
    }
    localStorage.setItem(
      "lists",
      JSON.stringify([this.state.listName, ...this.props.listNames])
    );

    this.props.onAddList &&
      this.props.onAddList(this.state.listName, +new Date());
  };

  _onLinkClicked = (event) => {
    if (
      this.state.listName.trim() === "" ||
      this.props.listNames.indexOf(this.state.listName) !== -1
    ) {
      event.preventDefault();
    }
  };

  _inputChangedHandler = (event) => {
    this.setState({
      listName: event.target.value,
    });
  };

  render() {
    return (
      <Layout home>
        <div className={styles.intro}>
          <div className={styles.introWrap}>
            <div className={styles.createNewWrap}>
              <InputCombine
                name="name"
                tag="Name"
                listName={this.state.listName}
                inputChangedHandler={this._inputChangedHandler}
              />

              <Button
                btnType="Success"
                size="Big"
                clicked={this._onAddHandler}
                elementType="normal"
              >
                <Link
                  to={`/cardCreator/${this.state.listName}`}
                  onClick={this._onLinkClicked}
                >
                  ADD LIST
                </Link>
              </Button>
            </div>

            <div className={styles.listsWrap}>
              <h2>Lists</h2>

              {this.props.listNames.map((list, index) => (
                <FileHolder
                  key={list}
                  index={index}
                  listName={list}
                  clicked={() => this._onClickedHandler(list)}
                  edit={() => this._onEditHandler(list)}
                  onDelete={() => this._onDeleteHandler(list)}
                />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listNames: state.cards.listNames,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // Add cards
    // onInitCards: (cards, listName, id) => {
    //   dispatch(initCards(cards, listName, id));
    // },
    onAddList: (listName, id) => {
      dispatch(onAddList(listName, id));
    },
    onGetLists: () => {
      dispatch(getLists());
    },
    onDelList: (listName, lists) => {
      dispatch(deleteList(listName, lists));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Intro));

Intro.propTypes = {
  onAddList: PropTypes.func.isRequired,
  onGetLists: PropTypes.func.isRequired,
  onDelList: PropTypes.func.isRequired,
  listNames: PropTypes.arrayOf(PropTypes.string).isRequired,
};
