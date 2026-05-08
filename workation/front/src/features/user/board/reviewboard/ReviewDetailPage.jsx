import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const dummyData = {
  1: {
    title: '제주 워케이션 후기',
    writer: 'user01',
    date: '2026.05.07',
    content:
      '정말 좋은 공간이었습니다. 뷰도 좋고 인터넷 속도도 빨라서 작업하기 최고였어요!',
  },
  2: {
    title: '부산 여행 후기',
    writer: 'user02',
    date: '2026.05.06',
    content: '바다 뷰가 너무 아름다웠습니다. 다음에 또 오고 싶어요.',
  },
  3: {
    title: '서울 스튜디오 이용 후기',
    writer: 'user03',
    date: '2026.05.05',
    content: '접근성이 뛰어나고 시설이 깔끔했습니다. 강력 추천합니다!',
  },
};

export default function ReviewDetailPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const review = dummyData[reviewId];

  const [showConfirm, setShowConfirm] = useState(false);

  if (!review) {
    return (
      <Wrapper>
        <p>존재하지 않는 후기입니다.</p>
      </Wrapper>
    );
  }

  function handleEdit() {
    // 실제 연동 시 navigate(`/board/review/edit/${reviewId}`) 로 변경
    navigate(`/board/review/write`);
  }

  function handleDelete() {
    // 실제 연동 시 API 호출 후 navigate
    setShowConfirm(false);
    navigate('/board/review/list');
  }

  return (
    <Wrapper>
      <DetailTitle>{review.title}</DetailTitle>

      <Meta>
        <span>{review.writer}</span>
        <span>{review.date}</span>
      </Meta>

      <Divider />

      <Body>{review.content}</Body>

      <ActionRow>
        <BackButton onClick={() => navigate('/board/review/list')}>
          ← 목록으로
        </BackButton>
        <RightButtons>
          <EditButton onClick={handleEdit}>수정</EditButton>
          <DeleteButton onClick={() => setShowConfirm(true)}>삭제</DeleteButton>
        </RightButtons>
      </ActionRow>

      {/* 삭제 확인 모달 */}
      {showConfirm && (
        <Overlay>
          <Modal>
            <ModalText>정말 삭제하시겠습니까?</ModalText>
            <ModalButtons>
              <ModalCancel onClick={() => setShowConfirm(false)}>
                취소
              </ModalCancel>
              <ModalConfirm onClick={handleDelete}>삭제</ModalConfirm>
            </ModalButtons>
          </Modal>
        </Overlay>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div``;

const DetailTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const Meta = styled.div`
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 14px;
  margin-bottom: 20px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin-bottom: 32px;
`;

const Body = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 48px;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RightButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #f3f4f6;
  }
`;

const EditButton = styled.button`
  padding: 12px 24px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #f3f4f6;
  }
`;

const DeleteButton = styled.button`
  padding: 12px 24px;
  border-radius: 999px;
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #dc2626;
  }
`;

/* ── 삭제 확인 모달 ── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

const Modal = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
`;

const ModalText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #111;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ModalCancel = styled.button`
  padding: 12px 28px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #f3f4f6;
  }
`;

const ModalConfirm = styled.button`
  padding: 12px 28px;
  border-radius: 999px;
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #dc2626;
  }
`;
