import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getReviewList, deleteReview } from '../api/Reviewapi';

function StarDisplay({ rating }) {
  return (
    <Stars>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} $filled={n <= rating}>
          ★
        </Star>
      ))}
    </Stars>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return '오늘';
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

// ── 카드 한 개 ──────────────────────────────────────────────────────────────
function ReviewCard({ review, onDelete, onEdit }) {
  const [expanded, setExpanded] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [needsMore, setNeedsMore] = useState(false);
  const contentRef = useRef(null);

  const imageUrls = review.images?.map((img) => img.s3Key) ?? [];

  // 실제 렌더된 텍스트가 3줄을 초과하는지 측정
  useEffect(() => {
    if (!contentRef.current) return;
    const lineHeight = parseFloat(
      getComputedStyle(contentRef.current).lineHeight
    );
    const scrollH = contentRef.current.scrollHeight;
    setNeedsMore(scrollH > lineHeight * 3 + 4); // 여유 4px
  }, [review.content]);

  return (
    <Card>
      {/* ── 카드 헤더: 프로필 + [제목·수정·삭제] ── */}
      <CardHeader>
        {/* 왼쪽: 아바타 */}
        <Avatar>{review.writer?.[0] ?? 'U'}</Avatar>

        {/* 오른쪽: 제목(중앙) + 메타 + 버튼 */}
        <HeaderRight>
          {/* 제목 — 프로필 기준 오른쪽 영역 중앙 */}
          <TitleRow>
            <CardTitle>{review.title}</CardTitle>
            <CardActions>
              <ActionBtn onClick={() => onEdit(review.id)}>수정</ActionBtn>
              <ActionBtn $danger onClick={() => setShowConfirm(true)}>
                삭제
              </ActionBtn>
            </CardActions>
          </TitleRow>

          {/* 작성자 · 별점 · 날짜 */}
          <WriterMeta>
            <WriterName>{review.writer}</WriterName>
            <StarDisplay rating={review.rating} />
            <DateText>{formatDate(review.createdAt)}</DateText>
          </WriterMeta>
        </HeaderRight>
      </CardHeader>

      {/* ── 이미지 그리드 ── */}
      {imageUrls.length > 0 && (
        <ImageGrid $count={Math.min(imageUrls.length, 4)}>
          {imageUrls.slice(0, 4).map((src, i) => (
            <ImageItem
              key={i}
              $single={imageUrls.length === 1}
              onClick={() => setLightboxIdx(i)}
            >
              <img src={src} alt={`리뷰 이미지 ${i + 1}`} />
              {i === 3 && imageUrls.length > 4 && (
                <MoreImageOverlay>+{imageUrls.length - 4}</MoreImageOverlay>
              )}
            </ImageItem>
          ))}
        </ImageGrid>
      )}

      {/* ── 본문: 3줄 클램프 ── */}
      <ContentArea>
        <CardContent ref={contentRef} $expanded={expanded}>
          {review.content}
        </CardContent>
        {needsMore && (
          <MoreBtn onClick={() => setExpanded((v) => !v)}>
            {expanded ? '접기 ▲' : '더보기 ▼'}
          </MoreBtn>
        )}
      </ContentArea>

      {/* ── 라이트박스 ── */}
      {lightboxIdx !== null && (
        <Overlay onClick={() => setLightboxIdx(null)}>
          <LightboxImg
            src={imageUrls[lightboxIdx]}
            alt="확대 이미지"
            onClick={(e) => e.stopPropagation()}
          />
          <LightboxClose onClick={() => setLightboxIdx(null)}>✕</LightboxClose>
          {lightboxIdx > 0 && (
            <LightboxPrev
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(lightboxIdx - 1);
              }}
            >
              ‹
            </LightboxPrev>
          )}
          {lightboxIdx < imageUrls.length - 1 && (
            <LightboxNext
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIdx(lightboxIdx + 1);
              }}
            >
              ›
            </LightboxNext>
          )}
        </Overlay>
      )}

      {/* ── 삭제 확인 모달 ── */}
      {showConfirm && (
        <Overlay onClick={() => setShowConfirm(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalText>정말 삭제하시겠습니까?</ModalText>
            <ModalButtons>
              <ModalCancel onClick={() => setShowConfirm(false)}>
                취소
              </ModalCancel>
              <ModalDelete
                onClick={() => {
                  setShowConfirm(false);
                  onDelete(review.id);
                }}
              >
                삭제
              </ModalDelete>
            </ModalButtons>
          </Modal>
        </Overlay>
      )}
    </Card>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function ReviewListPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const topRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getReviewList(currentPage)
      .then((data) => {
        setList(data.content ?? []);
        setTotalPages(data.totalPages ?? 1);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [currentPage]);

  function handlePageChange(page) {
    setCurrentPage(page);
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleDelete(id) {
    try {
      await deleteReview(id);
      const data = await getReviewList(currentPage);
      setList(data.content ?? []);
      setTotalPages(data.totalPages ?? 1);
      if ((data.content ?? []).length === 0 && currentPage > 0) {
        setCurrentPage((p) => p - 1);
      }
    } catch (err) {
      console.error(err);
      alert('삭제에 실패했습니다.');
    }
  }

  if (loading) return <Empty>불러오는 중...</Empty>;

  return (
    <Wrapper>
      <div ref={topRef} />

      <ListHeader>
        <ReviewCount>
          ⭐ 전체 후기 <Strong>{totalPages * 10}개+</Strong>
        </ReviewCount>
      </ListHeader>

      <FeedList>
        {list.length === 0 && <Empty>등록된 후기가 없습니다.</Empty>}
        {list.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onDelete={handleDelete}
            onEdit={(id) => navigate(`/board/review/write?id=${id}`)}
          />
        ))}
      </FeedList>

      {totalPages > 1 && (
        <Pagination>
          <PageBtn
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            ‹
          </PageBtn>
          {Array.from({ length: totalPages }, (_, i) => (
            <PageBtn
              key={i}
              $active={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </PageBtn>
          ))}
          <PageBtn
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
          >
            ›
          </PageBtn>
        </Pagination>
      )}
    </Wrapper>
  );
}

/* ── Styled Components ── */

const Wrapper = styled.div``;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.textDark};
`;

const ReviewCount = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

const Strong = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const FeedList = styled.div`
  display: flex;
  flex-direction: column;
`;

/* ── 카드 ── */
const Card = styled.div`
  padding: 28px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

/* 헤더: 아바타(왼쪽) + 오른쪽 전체 영역 */
const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

/* 프로필 오른쪽 전체 영역 */
const HeaderRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  /* 아바타 높이(44px)에 맞춰 내용 세로 중앙 정렬 */
  justify-content: center;
  min-height: 44px;
`;

/* 제목 + 수정/삭제 버튼을 같은 행에 */
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

/* 제목: 굵게, 중앙(오른쪽 영역 안에서 세로 중앙은 HeaderRight가 처리) */
const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.4;
  flex: 1;
`;

const CardActions = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

const ActionBtn = styled.button`
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid ${({ $danger }) => ($danger ? '#ef4444' : 'currentColor')};
  background: transparent;
  color: ${({ $danger, theme }) =>
    $danger ? '#ef4444' : theme.colors.textMid};
  &:hover {
    background: ${({ $danger, theme }) =>
      $danger ? '#ef4444' : theme.colors.primary};
    color: white;
    border-color: ${({ $danger, theme }) =>
      $danger ? '#ef4444' : theme.colors.primary};
  }
`;

const WriterMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WriterName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMid};
`;

const DateText = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textLight};
`;

/* 이미지 그리드 */
const ImageGrid = styled.div`
  display: grid;
  margin-bottom: 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  gap: 3px;
  ${({ $count }) => {
    if ($count === 1) return 'grid-template-columns: 1fr;';
    if ($count === 2) return 'grid-template-columns: 1fr 1fr;';
    if ($count === 3)
      return `
      grid-template-columns: 2fr 1fr;
      grid-template-rows: 1fr 1fr;
      & > *:first-child { grid-row: span 2; }
    `;
    return 'grid-template-columns: 1fr 1fr 1fr 1fr;';
  }}
`;

const ImageItem = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: ${({ $single }) => ($single ? '16/9' : '4/3')};
  cursor: pointer;
  background: ${({ theme }) => theme.colors.bgSection};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.2s;
    display: block;
  }
  &:hover img {
    transform: scale(1.03);
  }
`;

const MoreImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  color: white;
`;

/* 본문 영역 */
const ContentArea = styled.div``;

const CardContent = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.textMid};
  white-space: pre-line;
  margin: 0;

  /* 접혀있을 때: 3줄 클램프 */
  ${({ $expanded }) =>
    !$expanded &&
    `
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`;

const MoreBtn = styled.button`
  margin-top: 6px;
  background: none;
  border: none;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  &:hover {
    opacity: 0.75;
  }
`;

/* 라이트박스 */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
`;

const LightboxImg = styled.img`
  max-width: 80vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const LightboxClose = styled.button`
  position: fixed;
  top: 24px;
  right: 32px;
  font-size: 28px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
`;

const LightboxPrev = styled.button`
  position: fixed;
  left: 24px;
  font-size: 52px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
`;

const LightboxNext = styled.button`
  position: fixed;
  right: 24px;
  font-size: 52px;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
`;

/* 삭제 모달 */
const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 40px 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
`;

const ModalText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const ModalCancel = styled.button`
  padding: 12px 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: white;
  color: ${({ theme }) => theme.colors.textMid};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.bgSection};
  }
`;

const ModalDelete = styled.button`
  padding: 12px 28px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: none;
  background: #ef4444;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #dc2626;
  }
`;

/* 페이지네이션 */
const Empty = styled.div`
  padding: 48px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 15px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 40px;
`;

const PageBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.border};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.white};
  color: ${({ $active, theme }) => ($active ? 'white' : theme.colors.textMid)};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? '700' : '400')};
  cursor: pointer;
  transition: all 0.15s;
  &:hover:not(:disabled) {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : theme.colors.bgSection};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

/* 별점 */
const Stars = styled.div`
  display: flex;
  gap: 1px;
`;
const Star = styled.span`
  font-size: 14px;
  color: ${({ $filled }) => ($filled ? '#f59e0b' : '#e2e8f0')};
`;
