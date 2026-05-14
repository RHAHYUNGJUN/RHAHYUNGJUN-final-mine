// src/features/reservation/pages/ReservationInsertPage.jsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { createReservation } from '../api/reservationApi';

import { setError, setLoading } from '../store/reservationSlice';

function ReservationInsertPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [vo, setVo] = useState({
    couponId: '',
    stayId: '',
    officeId: '',
    guestCount: 1,
    reserverName: '',
    checkinDate: '',
    checkoutDate: '',
    reserverPhone: '',
    reserverEmail: '',
  });

  // input 변경
  function handleChange(e) {
    setVo({
      ...vo,
      [e.target.name]: e.target.value,
    });
  }

  // 예약 등록
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      const formData = new FormData();

      Object.keys(vo).forEach((key) => {
        formData.append(key, vo[key]);
      });

      const resp = await createReservation(formData);

      alert('예약 성공');

      console.log(resp.data);

      navigate('/');
    } catch (error) {
      console.error(error);

      dispatch(setError(error.response?.data));

      alert('예약 실패');
    } finally {
      dispatch(setLoading(false));
    }
  }

  return (
    <div>
      <h1>예약하기</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="number"
            name="couponId"
            placeholder="쿠폰 ID"
            value={vo.couponId}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="number"
            name="stayId"
            placeholder="숙소 ID"
            value={vo.stayId}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="number"
            name="officeId"
            placeholder="오피스 ID"
            value={vo.officeId}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="number"
            name="guestCount"
            placeholder="인원 수"
            value={vo.guestCount}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="reserverName"
            placeholder="예약자 이름"
            value={vo.reserverName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>체크인 날짜</label>
          <input
            type="datetime-local"
            name="checkinDate"
            value={vo.checkinDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>체크아웃 날짜</label>
          <input
            type="datetime-local"
            name="checkoutDate"
            value={vo.checkoutDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="text"
            name="reserverPhone"
            placeholder="예약자 전화번호"
            value={vo.reserverPhone}
            onChange={handleChange}
          />
        </div>

        <div>
          <input
            type="email"
            name="reserverEmail"
            placeholder="예약자 이메일"
            value={vo.reserverEmail}
            onChange={handleChange}
          />
        </div>

        <div>
          <button type="submit">예약하기</button>
        </div>
      </form>
    </div>
  );
}

export default ReservationInsertPage;
