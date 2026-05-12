import { useState } from 'react';
import styled from 'styled-components';

function SellerApplyForm() {
  const [formData, setFormData] = useState({
    businessNumber: '',
    companyName: '',
    accountNumber: '',
    bankName: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('판매자 신청 데이터:', formData);
    // API 호출 로직 추가 (예: useSellerApply 훅 사용)
  }

  return (
    <Card>
      <Title>판매자 신청</Title>
      <SubTitle>워케이션 호스트가 되어 전국을 연결해주세요!</SubTitle>

      <Form onSubmit={handleSubmit}>
        <InputWrapper>
          <Label>업체명</Label>
          <Input
            name="companyName"
            placeholder="예: 모래묻은 게스트하우스"
            onChange={handleChange}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>사업자 등록번호</Label>
          <Input
            name="businessNumber"
            placeholder="'-' 제외하고 숫자만 입력"
            onChange={handleChange}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>은행명</Label>
          <Input
            name="bankName"
            placeholder="예: 국민은행"
            onChange={handleChange}
          />
        </InputWrapper>

        <InputWrapper>
          <Label>정산 계좌번호</Label>
          <Input
            name="accountNumber"
            placeholder="'-' 제외하고 숫자만 입력"
            onChange={handleChange}
          />
        </InputWrapper>

        <AgreeArea>
          <input type="checkbox" required />
          <span>판매자 이용약관 및 개인정보 수집·이용에 동의합니다.</span>
        </AgreeArea>

        <SubmitButton type="submit">신청하기</SubmitButton>
      </Form>
    </Card>
  );
}

export default SellerApplyForm;

// Styled Components (SignupForm에서 사용된 스타일 재활용)
const Card = styled.section`
  width: 100%;
  max-width: 460px;
  background-color: white;
  border-radius: 28px;
  padding: 48px 42px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #3d4d54;
  margin-bottom: 10px;
`;

const SubTitle = styled.p`
  font-size: 15px;
  color: #7b8794;
  margin-bottom: 38px;
`;

const Form = styled.form``;

const InputWrapper = styled.div`
  margin-bottom: 22px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  height: 54px;
  border: 1px solid #d6dde2;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #4d6c75;
  }
`;

const AgreeArea = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 24px;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 54px;
  border: none;
  border-radius: 12px;
  background-color: #4d6c75;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
