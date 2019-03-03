import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Query } from "react-apollo";
import { GET_QUESTIONS_TAGS } from "GqlClient/question/queries";
import Anchor from "Reusable/Anchor";
import AllTags from "./AllTags";
import MatchingTags from "./MatchingTags";

const InvalidText = styled.div`
  color: red;
`;

const Input = styled.input`
  width: 40%;
  margin-right: 1em;

  @media (max-width: 600px) {
    width: 90%;
    margin-right: 0.5em;
  }
`;

const InputRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  padding-left: 1.8em;
`;

const TagsWrapper = styled.div`
  position: relative;
  margin-bottom: 1em;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 600px) {
    width: 90%;
  }
`;

interface QuestionTagsProps {
  onSelected: (selectedTags: string[]) => void;
}

class QuestionTags extends PureComponent<QuestionTagsProps, any> {
  state: any = {
    showAllTags: false,
    selectedTags: [],
    matchingTags: [],
    invalidTag: null
  };
  inputRef = React.createRef<HTMLInputElement>();

  hideAllTagsWindow = () => {
    this.setState((prevState: any) => {
      return { ...prevState, showAllTags: false };
    });
  };

  onSelectFromAllTags = (selectedTags: string[]) => {
    this.hideAllTagsWindow();
    this.inputRef.current.focus();

    if (!selectedTags || !selectedTags.length) return;

    this.setState(
      (prevState: any) => {
        return { ...prevState, selectedTags };
      },
      () => {
        this.notifyParents();
      }
    );

    this.inputRef.current.value = `${selectedTags.join(",")},`;
  };

  onSelectFromMatchingTags = (selectedTag: string) => {
    const { selectedTags } = this.state;
    selectedTags.push(selectedTag);
    this.inputRef.current.value = `${selectedTags.join(",")},`;
    this.setState(
      (prevState: any) => {
        return { ...prevState, selectedTags, matchingTags: [] };
      },
      () => {
        this.notifyParents();
      }
    );
    this.inputRef.current.focus();
  };

  setInvalidTag = (msg: string) => {
    this.setState((prevState: any) => {
      return { ...prevState, invalidTagMsg: msg };
    });
  };

  clearInvalidTag = () => {
    this.setState((prevState: any) => {
      return { ...prevState, invalidTagMsg: null };
    });
  };

  addToSelected = (tag: string) => {
    this.setState(
      (prevState: any) => {
        const { selectedTags } = prevState;
        return { ...prevState, selectedTags: [...selectedTags, tag] };
      },
      () => {
        this.notifyParents();
      }
    );
  };

  removeLastSelectedTag = () => {
    this.setState(
      (prevState: any) => {
        const selectedTags = [...prevState.selectedTags];
        selectedTags.pop();
        return { ...prevState, selectedTags };
      },
      () => {
        this.notifyParents();
      }
    );
  };

  clearSelectedTags = () => {
    this.setState((prevState: any) => {
      return { ...prevState, selectedTags: [] };
    });
  };

  setInputToSelected = () => {
    const { selectedTags } = this.state;
    this.inputRef.current.value = `${selectedTags.join(",")},`;
    this.clearMatchingTags();
    this.clearInvalidTag();
  };

  notifyParents = () => {
    const { selectedTags } = this.state;
    this.props.onSelected(selectedTags);
  };

  updateMatchingTags = (matchingTags: string[]) => {
    this.setState((prevState: any) => {
      return { ...prevState, matchingTags };
    });
  };

  clearMatchingTags = () => {
    this.setState((prevState: any) => {
      return { ...prevState, matchingTags: [] };
    });
  };

  // getInputSelection = (node: any) => {
  //   const startPos = node.selectionStart;
  //   const endPos = node.selectionEnd;
  //   return { startPos, endPos };
  // };

  handleBackspaceOrDelete = (e: any) => {
    const key = e.keyCode || e.charCode;

    if (key === 8 || key === 46) {
      this.removeLastSelectedTag();
      this.setInputToSelected();
    }
  };

  moveCursorToEnd = () => {
    if (this.inputRef.current.value) {
      // const val = this.inputRef.current.value; // store the value of the element
      // console.log('TCL: QuestionTags -> moveCursorToEnd -> val', val);
      // this.inputRef.current.value = ''; // clear the value of the element
      // this.inputRef.current.value = val; // set that value back.
      // eslint-disable-next-line
      this.inputRef.current.selectionStart = this.inputRef.current.selectionEnd = 100000;
    }
  };

  onClickInput = () => {
    this.moveCursorToEnd();
  };

  onKeyDownInput = (event: any) => {
    this.moveCursorToEnd();
    this.handleBackspaceOrDelete(event);
  };

  checkTagSelected = (tag: string) => {
    const { selectedTags } = this.state;
    return selectedTags.includes(tag);
  };

  onChangeInput = (e: any) => {
    const {
      target: { value }
    } = e;
    const trimmed = value.trim();
    if (value.charAt(value.length - 1) === " ") {
      this.inputRef.current.value = trimmed;
      return;
    } else if (trimmed.includes(",,")) {
      this.inputRef.current.value = trimmed.slice(0, -1);
      return;
    }

    const enteredTags = trimmed.split(",").filter((t: string) => !!t);
    const lastTag = enteredTags[enteredTags.length - 1];

    const lastChar = trimmed.charAt(trimmed.length - 1);
    if (lastChar === ",") {
      const lastTagExists = this.allTags.includes(lastTag);
      if (!lastTagExists) {
        this.setInvalidTag(`Tag ${lastTag} does not exist`);
        return;
      }

      const alreadySelected = this.checkTagSelected(lastTag);
      if (alreadySelected) {
        this.setInputToSelected();
        return;
      }

      this.addToSelected(lastTag);
      this.clearMatchingTags();
    } else {
      const matchingTags = this.allTags.filter((t: string) =>
        t.includes(lastTag)
      );
      this.updateMatchingTags(matchingTags);
    }

    /*  
    if backspace or delete, delete the whole previous word
    How to detect backspace or delte
    */
  };

  toggleAllTags = (show: boolean) => () => {
    this.setState((prevState: any) => {
      return { ...prevState, showAllTags: show };
    });
  };
  allTags: any;

  render() {
    const { showAllTags, matchingTags, invalidTagMsg } = this.state;

    return (
      <Query query={GET_QUESTIONS_TAGS} errorPolicy="all">
        {({ loading, error, data: { questionsTags: tags } }) => {
          this.allTags = tags;

          return (
            <TagsWrapper>
              {showAllTags && (
                <AllTags
                  tags={tags}
                  onSelect={this.onSelectFromAllTags}
                  onClose={this.hideAllTagsWindow}
                />
              )}
              <InputRow>
                <Input
                  ref={this.inputRef}
                  placeholder="Search by tag..."
                  onClick={this.onClickInput}
                  onChange={this.onChangeInput}
                  onKeyDown={this.onKeyDownInput}
                  type="text"
                />
                <Anchor onClick={this.toggleAllTags(true)}>all</Anchor>
              </InputRow>
              {invalidTagMsg && <InvalidText>{invalidTagMsg}</InvalidText>}
              {matchingTags.length > 0 && (
                <MatchingTags
                  tags={matchingTags}
                  onSelect={this.onSelectFromMatchingTags}
                />
              )}
            </TagsWrapper>
          );
        }}
      </Query>
    );
  }
}

export default QuestionTags;