import { useDispatch } from 'react-redux';

import {
  setLoading,
  setReservationList,
  setError,
} from '../store/reservationSlice';

import { getReservationList } from '../api/reservationApi';
import store from './../../../../app/store/store';

const dispatch = useDispatch();

async function fetchReservationList() {
  try {
    dispatch(setLoading(true));

    const resp = await getReservationList(0);

    dispatch(setReservationList(resp.data));
  } catch (error) {
    dispatch(setError(error.response.data));
  } finally {
    dispatch(setLoading(false));
  }
}
