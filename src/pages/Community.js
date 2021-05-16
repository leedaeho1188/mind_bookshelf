import React, { useEffect, useState } from "react";
import { CommunityQnA } from "../components/Community/communityindex";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { api as communityActions } from "../redux/modules/community";
import Loader from "react-loader-spinner";
import { setLoading } from "../redux/modules/community";
import ReplayIcon from "@material-ui/icons/Replay";
import { CardModal } from "../components/Community/communityindex";
import { api as commentActions } from "../redux/modules/comment";

const Community = () => {
  const dispatch = useDispatch();
  const question_list = useSelector((state) => state.community.question);
  const is_loading = useSelector((state) => state.community.is_loading);
  const [cardModal, setCardModal] = useState(false);

  useEffect(() => {
    dispatch(communityActions.communityQuestionAX());
    return () => {
      dispatch(setLoading(true));
    };
  }, []);

  const openCard = (a) => {
    const type = "community";
    setCardModal(true);
    dispatch(communityActions.getCardDetail(a.answerId, type));
    dispatch(commentActions.getCommentAX(a.answerId));
  };

  const closeCardModal = () => {
    setCardModal(false);
  };

  return (
    <React.Fragment>
      {cardModal ? <CardModal close={closeCardModal} /> : null}
      {is_loading ? (
        <CommunityBtn style={{ paddingTop: "5px" }}>
          <Loader type="TailSpin" color="Black" height={30} width={30} />
        </CommunityBtn>
      ) : (
        <CommunityBtn
          onClick={() => {
            dispatch(communityActions.communityQuestionAX());
            dispatch(setLoading(true));
          }}
        >
          <ReplayIcon fontSize="large" />
        </CommunityBtn>
      )}
      <ImgRight />
      <ImgLeft />
      <CommunityContainer>
        {is_loading ? (
          <div style={{ marginTop: "250px" }}>
            <Loader type="Oval" color="#3d66ba" height={50} width={50} />
          </div>
        ) : (
          <CommunityBox>
            {question_list !== 0
              ? question_list.map((q) => {
                  return <CommunityQnA key={q.id} {...q} openCard={openCard} />;
                })
              : null}
          </CommunityBox>
        )}
      </CommunityContainer>
    </React.Fragment>
  );
};

const CommunityBtn = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 26px;
  bottom: 100px;
  width: 63px;
  height: 63px;
  border-radius: 50px;
  background: white;
  z-index: 50;
  cursor: pointer;
  box-shadow: 0px 0px 20px #0000001a;
  @media (max-width: 500px) {
    width: 50px;
    height: 50px;
    right: 14px;
    bottom: 80px;
  }
`;

const CommunityBox = styled.div`
  height: 100vh;
  margin: 100px 0px 0px 0px;
  width: 100%;
  max-width: 1200px;
  padding: 0px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  @media (max-width: 900px) {
    margin: 100px 0px 60px 0px;
  }
  @media (max-width: 500px) {
    margin: 60px 0px 0px 0px;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url("https://user-images.githubusercontent.com/67696504/117994109-4088f980-b37b-11eb-8f2c-9d42c93fd0a3.png");
  }
  ::-webkit-scrollbar {
    display: none;
    width: 10px; /* width of the entire scrollbar */
  }

  ::-webkit-scrollbar-track {
    display: none;
    background: none; /* color of the tracking area */
  }

  ::-webkit-scrollbar-thumb {
    display: none;
    background-color: #ffffff; /* color of the scroll thumb */
    border-radius: 20px; /* roundness of the scroll thumb */
  }
  @media (max-width: 750px) {
    margin: 50px 0px 0px 0px;
    padding: 20px 20px;
  }
`;

const CommunityContainer = styled.div`
  z-index: 2;
  width: 100%;
  // height:100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow-y: auto;
  @media (max-width: 900px) {
    z-index: 20;
  }
`;

const ImgRight = styled.div`
  // z-index:-1;
  position: fixed;
  background-image: url("https://user-images.githubusercontent.com/77574867/116996886-0c785d80-ad17-11eb-9afd-175a104b7f33.png");
  background-size: contain;
  background-repeat: no-repeat;
  right: -70px;
  bottom: -13px;
  width: 593px;
  height: 731px;
  opacity: 0.8;
  pointer-events: none;
  @media (max-width: 1400px) {
    display: none;
  }
`;

const ImgLeft = styled.div`
  // z-index:2;
  position: fixed;
  background-image: url("https://user-images.githubusercontent.com/77574867/116996878-0b473080-ad17-11eb-8910-108950e25cb8.png");
  background-size: contain;
  background-repeat: no-repeat;
  left: -20px;
  top: 249px;
  width: 365px;
  height: 341px;
  opacity: 0.8;
  pointer-events: none;
  @media (max-width: 1400px) {
    display: none;
  }
`;

export default Community;
