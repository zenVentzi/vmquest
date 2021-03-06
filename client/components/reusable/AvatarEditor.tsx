import React, { useRef } from "react";
import styled from "styled-components";
import Editor from "react-avatar-editor";
import { Mutation, MutationFn } from "react-apollo";
import TextBtn from "Reusable/TextBtn";
import { UPLOAD_AVATAR } from "GqlClient/user/mutations";
import {
  UploadAvatarMutation,
  UploadAvatarMutationVariables
} from "GqlClient/autoGenTypes";

const Wrapper = styled.div`
  ${"" /* position: fixed; */} z-index: 1;
  ${"" /* top: 30px; */} padding: 3px 3px 3px 3px;
  background-color: white;
  border: 1px solid black;
  border-radius: 8px;
  text-align: center;
`;

const Hint = styled.div`
  color: black;
`;

interface AvatarEditorProps {
  image: string | File;
  onClose: (src?: string) => void; // split that into onSave and onClose
}

const AvatarEditor = (props: AvatarEditorProps) => {
  const editor = useRef<Editor>(null);
  const onClickSave = (
    uploadAvatar: MutationFn<
      UploadAvatarMutation,
      UploadAvatarMutationVariables
    >
  ) => async () => {
    if (editor) {
      const canvasScaled = editor.current!.getImageScaledToCanvas();
      const base64Img = canvasScaled.toDataURL("image/jpeg");
      const variables = { base64Img };
      // show loading/uploading
      const res = await uploadAvatar({ variables });
      if (!res || !res.data) {
        throw Error("Upload avatar mutation failed");
      }

      const src = res.data.uploadAvatar;

      props.onClose(src);
    }
  };

  const onClickCancel = () => {
    props.onClose();
  };

  return (
    <Mutation<UploadAvatarMutation, UploadAvatarMutationVariables>
      mutation={UPLOAD_AVATAR}
    >
      {uploadAvatar => {
        const { image } = props;

        return (
          <Wrapper>
            <Editor
              ref={editor}
              image={image}
              width={150}
              height={150}
              border={50}
              scale={1.2}
              borderRadius={150}
              color={[1, 1, 1, 1]}
            />
            <Hint>Drag to adjust</Hint>
            <div>
              <TextBtn
                onClick={onClickSave(uploadAvatar)}
                color="white"
                backgroundColor="black"
              >
                Save
              </TextBtn>
              <TextBtn
                onClick={onClickCancel}
                color="white"
                backgroundColor="black"
              >
                Cancel
              </TextBtn>
            </div>
          </Wrapper>
        );
      }}
    </Mutation>
  );
};

export default AvatarEditor;
