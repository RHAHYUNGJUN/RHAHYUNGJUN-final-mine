import { useState } from 'react';
import styled from 'styled-components';

const coupons = [
  {
    id: 1,
    label: '신규 가입 축하 쿠폰',
    discount: 10,
    code: 'WELCOME10',
    description: '첫 예약 시 10% 할인',
    expiry: '2026.06.30',
    color: '#c3edf6',
    textColor: '#2c6480',
  },
  {
    id: 2,
    label: '봄 시즌 특별 쿠폰',
    discount: 20,
    code: 'SPRING20',
    description: '5월 한 달 예약 시 20% 할인',
    expiry: '2026.05.31',
    color: '#f6e5ba',
    textColor: '#92640a',
  },
  {
    id: 3,
    label: '주말 특가 쿠폰',
    discount: 15,
    code: 'WEEKEND15',
    description: '주말 예약 한정 15% 할인',
    expiry: '2026.06.15',
    color: '#e0f2e9',
    textColor: '#276749',
  },
  {
    id: 4,
    label: '장기 이용 감사 쿠폰',
    discount: 25,
    code: 'LOYAL25',
    description: '3박 이상 예약 시 25% 할인',
    expiry: '2026.07.31',
    color: '#ede9fe',
    textColor: '#5b21b6',
  },
];

export default function EventPage() {
  const [copiedId, setCopiedId] = useState(null);

  function handleCopy(coupon) {
    navigator.clipboard.writeText(coupon.code).then(() => {
      setCopiedId(coupon.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  return (
    <Wrapper>
      <Title>이벤트 &amp; 쿠폰</Title>
      <SubTitle>쿠폰 코드를 복사해 예약 시 적용하세요</SubTitle>

      <Grid>
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id} $bg={coupon.color}>
            <CardTop $color={coupon.textColor}>
              <DiscountBadge $color={coupon.textColor}>
                {coupon.discount}% OFF
              </DiscountBadge>
              <CouponLabel>{coupon.label}</CouponLabel>
              <CouponDesc>{coupon.description}</CouponDesc>
            </CardTop>

            <Divider>
              <Circle className="left" />
              <DashedLine />
              <Circle className="right" />
            </Divider>

            <CardBottom>
              <ExpiryText>유효기간 · {coupon.expiry}까지</ExpiryText>
              <CodeRow>
                <CodeBox>{coupon.code}</CodeBox>
                <CopyButton
                  $copied={copiedId === coupon.id}
                  onClick={() => handleCopy(coupon)}
                >
                  {copiedId === coupon.id ? '✓ 복사됨' : '코드 복사'}
                </CopyButton>
              </CodeRow>
            </CardBottom>
          </CouponCard>
        ))}
      </Grid>

      <Notice>
        <NoticeTitle>쿠폰 유의사항</NoticeTitle>
        <NoticeList>
          <li>
            쿠폰은 예약 결제 시 쿠폰 코드 입력란에 입력하면 자동 적용됩니다.
          </li>
          <li>쿠폰은 1회 예약에 1장만 사용 가능합니다.</li>
          <li>일부 쿠폰은 특정 상품에 한해 적용될 수 있습니다.</li>
          <li>유효기간이 지난 쿠폰은 사용이 불가합니다.</li>
        </NoticeList>
      </Notice>
    </Wrapper>
  );
}

/* ── Styled Components ── */

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
`;

const Title = styled.h1`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.textDark};
`;

const SubTitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textMid};
  margin-bottom: 48px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 64px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CouponCard = styled.div`
  background: ${({ $bg }) => $bg};
  border-radius: 20px;
  overflow: hidden;
`;

const CardTop = styled.div`
  padding: 32px 28px 24px;
  color: ${({ $color }) => $color};
`;

const DiscountBadge = styled.div`
  display: inline-block;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.05em;
  background: ${({ $color }) => $color};
  color: white;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 16px;
`;

const CouponLabel = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const CouponDesc = styled.div`
  font-size: 14px;
  opacity: 0.8;
`;

const Divider = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 -1px;

  .left {
    left: -12px;
  }
  .right {
    right: -12px;
  }
`;

const Circle = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.colors.bg};
  border-radius: 50%;
`;

const DashedLine = styled.div`
  width: 100%;
  border-top: 2px dashed rgba(0, 0, 0, 0.12);
`;

const CardBottom = styled.div`
  padding: 20px 28px 28px;
  background: rgba(255, 255, 255, 0.45);
`;

const ExpiryText = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 12px;
`;

const CodeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CodeBox = styled.div`
  flex: 1;
  padding: 10px 16px;
  background: white;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #333;
`;

const CopyButton = styled.button`
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: ${({ $copied }) => ($copied ? '#22c55e' : 'black')};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${({ $copied }) => ($copied ? '#16a34a' : '#333')};
  }
`;

const Notice = styled.div`
  border-top: 2px solid black;
  padding-top: 32px;
`;

const NoticeTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.textDark};
`;

const NoticeList = styled.ul`
  list-style: disc;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textMid};
    line-height: 1.6;
  }
`;
