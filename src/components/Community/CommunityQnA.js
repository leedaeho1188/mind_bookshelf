import React, { useState } from "react";
import styled from "styled-components";
import { history } from "../../redux/configStore";
import { CardModal } from "./communityindex";
import { useSelector, useDispatch } from "react-redux";

import { api as commentActions } from "../../redux/modules/comment";
import { setAnswerInfo } from "../../redux/modules/comment";

const CommunityQnA = (props) => {
  const dispatch = useDispatch();
  const [cardModal, setCardModal] = useState();
  const user = useSelector((state) => state.user.user);

  const closeCardModal = () => {
    setCardModal(false);
  };

  return (
    <React.Fragment>
      <QnAContainer>
        <Question>{props.contents}</Question>
        <button
          onClick={() => {
            history.push(`/community/${props.id}`);
          }}
        >
          더보기
        </button>
        <Topic>#{props.topic}</Topic>
        <AnswerContainer>
          {props.answers.map((a) => {
            return (
              <Answer key={a.id}>
                {cardModal ? <CardModal close={closeCardModal} /> : null}
                <AnswerHeader
                  onClick={() => {
                    if (a.userId === user.id) {
                      history.push("/mybook");
                      return;
                    }
                    history.push(`/others/${a.userId}`);
                  }}
                >
                  <AnswerProfileImg src={a.profileImg} />
                  <AnswerNickname>{a.nickname}</AnswerNickname>
                </AnswerHeader>
                <AnswerContents
                  onClick={() => {
                    setCardModal(true);
                    dispatch(
                      setAnswerInfo({
                        ...a,
                        content: props.contents,
                        questionId: props.id,
                      })
                    );
                    dispatch(commentActions.getCommentAX(a.answerId));
                  }}
                >
                  {a.contents}
                </AnswerContents>
                <AnswerLikes>{a.likeCount} Likes</AnswerLikes>
              </Answer>
            );
          })}
        </AnswerContainer>
      </QnAContainer>
    </React.Fragment>
  );
};

const QnAContainer = styled.div`
  width: 650px;
  display: flex;
  flex-direction: column;
  align-items: start;
  @media (max-width: 1800px) {
    margin-bottom: 60px;
  }
`;
const Question = styled.div`
  font-size: 30px;
  font-weight: 600;
  width: 400px;
  height: 100px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AnswerContainer = styled.div`
  display: flex;
  margin-top: 50px;
`;

const Answer = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 13px;
  background-color: #c4c4c4;
  border-radius: 30px;
  margin-right: 15px;
`;

const AnswerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const AnswerProfileImg = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 40px;
  object-fit: cover;
`;

const AnswerNickname = styled.div`
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AnswerContents = styled.div`
  margin-top: 10px;
  font-size: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    font-weight: 600;
  }
  cursor: pointer;
`;

const AnswerLikes = styled.div`
  text-align: right;
  font-weight: 600;
`;

const Topic = styled.div`
  margin-top: 30px;
  display: inline-block;
  background-color: #e5e5e5;
  padding: 5px 14px;
  border-radius: 18px;
  font-weight: 600;
`;

export default CommunityQnA;