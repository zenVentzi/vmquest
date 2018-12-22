import React, { Component } from 'react';
import styled from 'styled-components';
import { Formik, Form, ErrorMessage } from 'formik';
import Textarea from 'react-textarea-autosize';
import { Query, Mutation } from 'react-apollo';
import { toast } from 'react-toastify';
import Comment from './Comment';
import CommentsGql from './CommentsGql';
import Panel from '../Panel';

const CommentInput = styled(Textarea)`
  /* margin-top: 2em; */
  width: 79%;
  min-height: min-content;
  background: white;
  color: black;
  margin-bottom: 1em;
`;

const ErrorText = styled.div`
  color: red;
  margin-bottom: 1em;
`;

class Comments extends Component {
  // componentDidMount() {
  //   console.log(`mount`);
  // }
  state = { comments: this.props.comments };

  componentDidMount(prevProps, prevState) {
    if (this.highlightedComment) {
      this.panel.scrollTop = this.highlightedComment.offsetTop;
    }
  }

  validateForm = ({ commentAnswerMutation }) => async values => {
    // const a = await commentAnswerMutation({ bla: 5 });
    const errors = {};
    if (values.comment.length < 7)
      errors.comment = 'Comment must be at least 7 characters';

    return errors;
  };

  onSubmitForm = commentAnswerMutation => async (
    values,
    { setSubmitting, resetForm }
  ) => {
    // console.log(commentAnswerMutation);
    const addedComment = await commentAnswerMutation({
      commentValue: values.comment,
    });
    setSubmitting(false);
    resetForm({ comment: '' });
  };

  onEditComment = editCommentMutation => async ({
    commentId,
    commentValue,
  }) => {
    const { answerId } = this.props;
    const variables = { answerId, commentId, commentValue };
    await editCommentMutation({ variables });
    toast.success('Comment edited!');
  };

  onRemoveComment = removeCommentMutation => async ({ commentId }) => {
    const { answerId } = this.props;
    const variables = { answerId, commentId };
    await removeCommentMutation({ variables });
    toast.success('Comment removed!');
  };

  renderComments = ({ editCommentMutation, removeCommentMutation }) => {
    const { scrollToComment } = this.props;
    const { comments } = this.state;

    if (!comments || !comments.length)
      return <div> Be the first to add a comment </div>;

    const renderReversedComments = () => {
      const res = [];
      const copy = comments.slice();

      while (copy.length) {
        const com = copy.pop();
        const commentProps = {
          key: com.id,
          comment: com,
          onEdit: this.props.onEditComment,
          onRemove: this.props.onRemoveComment,
        };

        if (scrollToComment && scrollToComment === com.id) {
          commentProps.ref = ref => {
            this.highlightedComment = ref;
          };
        }

        res.push(<Comment {...commentProps} />);
      }
      return res;
    };

    return renderReversedComments();
  };

  render() {
    return (
      <CommentsGql>
        {(commentAnswer, editComment, removeComment) => {
          return (
            <Panel
              ref={ref => {
                this.panel = ref;
              }}
            >
              <Formik
                initialValues={{ comment: '' }}
                validateOnBlur={false}
                validate={this.validateForm}
                // validate={this.validateForm}
                onSubmit={this.onSubmitForm(commentAnswer)}
              >
                {({
                  values,
                  handleChange,
                  submitForm,
                  handleBlur,
                  isSubmitting,
                }) => (
                  <Form style={{ width: '100%', textAlign: 'center' }}>
                    <CommentInput
                      name="comment"
                      placeholder="Add a comment..."
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.comment || ''}
                      disabled={isSubmitting}
                      onKeyPress={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (!isSubmitting) submitForm();
                        }
                      }}
                    />
                    <ErrorMessage
                      name="comment"
                      render={msg => <ErrorText>{msg}</ErrorText>}
                    />
                  </Form>
                )}
              </Formik>
              {this.renderComments({
                editCommentMutation: editComment,
                removeCommentMutation: removeComment,
              })}
            </Panel>
          );
        }}
      </CommentsGql>
    );
  }
}

export default Comments;
