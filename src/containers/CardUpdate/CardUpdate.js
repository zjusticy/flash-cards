import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
import styles from "./CardUpdate.module.scss";

// import CardsWrapper from '../../hoc/CardsWrapper/CardsWrapper';
import Input from "../../components/UI/Input/Input";
import {
  onUpdateCard,
  onAddCard,
  initExist,
  padDeactive,
  onDeleteCard,
  // initCards,
  loadCards,
} from "../../store/cards";

import CardsWrapper from "../../hoc/CardsWrapper/CardsWrapper";
import Layout from "../../hoc/Layout/Layout";
import PadList from "../../components/PadList/PadList";
import Button from "../../components/UI/Button/Button";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";

// import { database } from '../../components/Firebase/firebase';
import CodeBlock from "../../components/CodeBlock/codeBlock";

const myPlaceHolderF =
  'This is the front side \n\nUse "#" and a blank space at the beginning before the actual title';
const myPlaceHolderB = "This is the back side";

// const PadShow = (WrappedComponent, adder) => {
class CardUpdate extends Component {
  /**
   * Check the input valid or not
   * @param {string} value
   * @return {boolean}
   */
  static _checkValidity(value) {
    let isValid = false;

    isValid = value.trim() !== "";

    return isValid;
  }

  constructor(props) {
    super(props);
    this.state = {
      orderForm: {
        front: {
          value: myPlaceHolderF,
          valid: true,
        },
        back: {
          value: myPlaceHolderB,
          valid: true,
        },
      },
      formIsValid: true,
      preview: false,
      addNew: true,
    };
  }

  componentDidMount() {
    this._loadCards();
  }

  /**
   * Set new initial value
   * @param {string} frontValue
   * @param {string} backValue
   */

  _setUpdate = (frontValue, backValue) => {
    this.setState((prevState) => {
      const updatedOrderForm = {
        ...prevState.orderForm,
      };

      updatedOrderForm.front = {
        ...updatedOrderForm.front,
        value: frontValue,
        valid: true,
      };

      updatedOrderForm.back = {
        ...updatedOrderForm.back,
        value: backValue,
        valid: true,
      };

      return {
        orderForm: updatedOrderForm,
        formIsValid: true,
        addNew: false,
      };
    });
  };

  /**
   * Clear the hint info when focusing
   * @param {object} event
   * @param {string} iniValue
   * @param {string} inputIdentifier
   */

  _focusedHandler = (event, iniValue, inputIdentifier) => {
    if (event.target.value === iniValue) {
      this.setState((prevState) => {
        const updatedOrderForm = {
          ...prevState.orderForm,
        };
        updatedOrderForm[inputIdentifier] = {
          ...updatedOrderForm.front,
          value: "",
          valid: false,
        };
        return {
          orderForm: updatedOrderForm,
          formIsValid: false,
        };
      });
    }
  };

  /**
   * Back to initial when empty and blured
   * @param {object} event
   * @param {string} iniValue
   * @param {string} inputIdentifier
   */

  _bluredHandler = (event, iniValue, inputIdentifier) => {
    if (event.target.value === "") {
      this.setState((prevState) => {
        const updatedOrderForm = {
          ...prevState.orderForm,
        };

        updatedOrderForm[inputIdentifier] = {
          ...updatedOrderForm.front,
          value: iniValue,
          valid: CardUpdate._checkValidity(
            updatedOrderForm[inputIdentifier].value
          ),
        };

        let formIsValid = true;
        formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;

        return {
          orderForm: updatedOrderForm,
          formIsValid,
        };
      });
    }
  };

  /**
   * Bind the input data and container state
   * @param {object} event
   * @param {string} inputIdentifier
   */

  _inputChangedHandler = (event, inputIdentifier) => {
    const { value } = event.target;
    this.setState((prevState) => {
      const updatedOrderForm = {
        ...prevState.orderForm,
      };

      updatedOrderForm[inputIdentifier] = {
        ...updatedOrderForm.front,
        value,
        valid: CardUpdate._checkValidity(value),
      };

      let updatedFormIsValid = true;

      updatedFormIsValid =
        updatedOrderForm.front.valid && updatedOrderForm.back.valid;

      return {
        orderForm: updatedOrderForm,
        formIsValid: updatedFormIsValid,
      };
    });
  };

  // Function when add button clicked
  _cardAddedHandler = () => {
    this.setState((prevState) => {
      const newCard = {
        id: +new Date(),
        // id: Math.random().toString(36).substr(2),
        title: this._showTitle(prevState.orderForm.front.value) || "Card",
        frontValue: prevState.orderForm.front.value,
        backValue: prevState.orderForm.back.value,
      };

      const updatedOrderForm = {
        ...prevState.orderForm,
      };

      updatedOrderForm.front = {
        ...updatedOrderForm.front,
        value: myPlaceHolderF,
        valid: true,
      };

      updatedOrderForm.back = {
        ...updatedOrderForm.back,
        value: myPlaceHolderB,
        valid: true,
      };

      this.props.onAddCard &&
        this.props.onAddCard(this.props.activeListName, newCard);

      return {
        orderForm: updatedOrderForm,
        formIsValid: true,
        preview: false,
      };
    });
  };

  // Function when update button clicked
  _cardUpdatedHandler = () => {
    const newCard = {
      id: this.props.activeId,
      title: this._showTitle(this.state.orderForm.front.value) || "Card",
      frontValue: this.state.orderForm.front.value,
      backValue: this.state.orderForm.back.value,
    };

    // Use reducer's function
    this.props.onUpdate &&
      this.props.onUpdate(newCard);
  };

  /**
   * Function when delete button clicked
   * @param {string} cardId
   */

  _cardRemoveHandler = (cardId) => {
    // Use reducer's function
    this.props.onDeleted &&
      this.props.onDeleted(cardId);
  };

  // Load card when initial generate page
  _loadCards = async () => {
    // Get the name from URL
    if (this.props.match.params && this.props.match.params.name) {
      if (this.props.match.params.name !== this.props.activeListName) {
        if (
          Object.keys(this.props.cardsCache).includes(
            this.props.match.params.name
          )
        ) {
          const cardIds = Object.keys(
            this.props.cardsCache[this.props.match.params.name]
          ).sort((a, b) => {
            return b - a;
          });
          this.props.initExist &&
            this.props.initExist(this.props.match.params.name, cardIds, null);
        } else {
          this.props.onLoadCards &&
            this.props.onLoadCards(this.props.match.params.name);
        }
      }
    }
  };

  // Show or hide the back value
  _showToggled = () => {
    this.setState((prevState) => ({ hide: !prevState.hide }));
  };

  // Preview or raw string the markdown preview
  _preToggled = () => {
    this.setState((prevState) => ({ preview: !prevState.preview }));
  };

  // Show or hide the markdown preview
  _addToggled = () => {
    this.setState((prevState) => {
      const updatedOrderForm = {
        ...prevState.orderForm,
      };

      updatedOrderForm.front = {
        ...updatedOrderForm.front,
        value: myPlaceHolderF,
        valid: true,
      };

      updatedOrderForm.back = {
        ...updatedOrderForm.back,
        value: myPlaceHolderB,
        valid: true,
      };

      return {
        orderForm: updatedOrderForm,
        addNew: !prevState.addNew,
        formIsValid: true,
        preview: false,
      };
    });
  };

  /**
   * Check the title of the input text
   * @param {string} text
   * @return {sting}
   */
  _showTitle = (text) => {
    const filter = /^#\s(.*)\n?/g;
    const result = filter.exec(text);

    if (result) {
      return result[1];
    }

    return "";
  };

  render() {
    const { onCancelled, activeId } = this.props;

    let form = (
      <form>
        <Input
          elementType="textarea"
          id="frontInput"
          value={this.state.orderForm.front.value}
          changed={(event) => this._inputChangedHandler(event, "front")}
          focused={(event) =>
            this._focusedHandler(event, myPlaceHolderF, "front")
          }
          blured={(event) =>
            this._bluredHandler(event, myPlaceHolderF, "front")
          }
        />
        <Input
          // key={this.props.location.state.id}
          elementType="textarea"
          id="backInput"
          value={this.state.orderForm.back.value}
          changed={(event) => this._inputChangedHandler(event, "back")}
          focused={(event) =>
            this._focusedHandler(event, myPlaceHolderB, "back")
          }
          blured={(event) => this._bluredHandler(event, myPlaceHolderB, "back")}
        />
      </form>
    );

    if (this.state.preview) {
      form = (
        <>
          <div className={`${styles.cardShowDouble} ${styles.markdownStyle}`}>
            <ReactMarkdown
              source={this.state.orderForm.front.value}
              renderers={{ code: CodeBlock }}
            />
          </div>
          <div className={`${styles.cardShowDouble} ${styles.markdownStyle}`}>
            <ReactMarkdown
              source={this.state.orderForm.back.value}
              renderers={{ code: CodeBlock }}
            />
          </div>
        </>
      );
    }

    // const deleted={adder ? null : () => this._cardRemoveHandler(activeId)}

    let buttons = (
      <>
        <Button
          btnType="Success"
          disabled={!this.state.formIsValid}
          size="Medium"
          clicked={this._preToggled}
          elementType="normal"
        >
          {this.state.preview ? "BACK" : "PREVIEW"}
        </Button>
        <Button
          btnType="Success"
          disabled={!this.state.formIsValid}
          size="Medium"
          clicked={this._cardAddedHandler}
          elementType="normal"
        >
          ADD
        </Button>
      </>
    );

    if (!this.state.addNew) {
      buttons = (
        <>
          <Button
            btnType="Success"
            size="Medium"
            clicked={this._preToggled}
            elementType="normal"
          >
            {this.state.preview ? "BACK" : "PREVIEW"}
          </Button>
          <Button
            btnType="Success"
            size="Medium"
            elementType="normal"
            clicked={() => {
              this._cardRemoveHandler(activeId);
              onCancelled();
              this._addToggled();
              // history.goBack();
            }}
          >
            DELETE
          </Button>
          <Button
            btnType="Success"
            size="Medium"
            elementType="normal"
            clicked={() => {
              onCancelled();
              // history.goBack();
              this._addToggled();
            }}
          >
            CANCEL
          </Button>
          <Button
            btnType="Success"
            size="Medium"
            elementType="normal"
            disabled={!this.state.formIsValid}
            clicked={() => {
              onCancelled();
              this._cardUpdatedHandler();
              // history.goBack();
              this._addToggled();
            }}
          >
            UPDATE
          </Button>
        </>
      );
    }

    return (
      <div className={styles.app}>
        <div className={styles.sideBar}>
          <Toolbar drawerToggleClicked={this._navToggleHandler} />
          <PadList setUpdate={this._setUpdate} />
        </div>
        <Layout home={false}>
          <div className={styles.memShowWrapper}>
            <div className={styles.padShowWrapper}>
              <CardsWrapper
                mode={this.state.mode}
                memBoard={false}
                preview={this.state.preview}
              >
                {form}
              </CardsWrapper>
              <div className={styles.btnWrapper}>{buttons}</div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cardsCache: state.cards.cardsCache,
    activeListName: state.cards.activeListName,
    activeId: state.cards.activeId,
    // mode: state.cards.modeS,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // initCards: (cards, listName, ids, id) => {
    //   dispatch(initCards(cards, listName, ids, id));
    // },
    initExist: (listName, ids, id) => {
      dispatch(initExist(listName, ids, id));
    },
    // Add cards
    onAddCard: (card) => {
      dispatch(onAddCard(card));
    },
    onDeleted: (cardId) => {
      dispatch(onDeleteCard(cardId));
    },
    onLoadCards: (listName) => {
      dispatch(loadCards(listName));
    },
    onUpdate: (card) => {
      dispatch(onUpdateCard(card));
    },
    // Deacive card
    onCancelled: () => {
      dispatch(padDeactive());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CardUpdate));

CardUpdate.propTypes = {
  cardsCache: PropTypes.objectOf(
    PropTypes.shape({
      frontValue: PropTypes.string,
      backValue: PropTypes.string,
      id: PropTypes.number,
      title: PropTypes.string,
    })
  ).isRequired,
  activeListName: PropTypes.string.isRequired,
  activeId: PropTypes.number,
  // initCards: PropTypes.func.isRequired,
  initExist: PropTypes.func.isRequired,
  onAddCard: PropTypes.func.isRequired,
  onDeleted: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancelled: PropTypes.func.isRequired,
  onLoadCards: PropTypes.func.isRequired,
};

CardUpdate.defaultProps = {
  activeId: null,
};
