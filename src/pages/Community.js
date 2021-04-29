import React, {useEffect} from 'react' 
import CommunityQnA from '../components/CommunityQnA'
import styled from 'styled-components'
import {useDispatch, useSelector} from 'react-redux'
import {api as communityActions} from "../redux/modules/community"

const Community = () => {
  const dispatch = useDispatch()
  const question_list = useSelector((state) => state.community.question)
  console.log(question_list)

  useEffect(() => {
    dispatch(communityActions.communityQuestionAX())
  },[])

  return(
    <React.Fragment>
      <CommunityContainer>
        {question_list !== 0 ?
        question_list.map((q) => {
          return <CommunityQnA key={q.id} {...q} />
        }):null}
      </CommunityContainer>
    </React.Fragment>
  )

}

const CommunityContainer = styled.div`
  width: 100%;
  margin: 400px 60px 0 60px;
  display: flex;
  justify-content: space-around;
`

export default Community
