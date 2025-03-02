/* eslint-disable */
import axios from 'axios'; // ✅ Import axios
import { showAlert } from './alerts'; // ✅ Import showAlert

export const bookTour = async tourId => {
  try {
    // 1️⃣ Get checkout session from API
    const session = await axios.get(
      `http://127.0.0.1:8000/api/v1/booking/checkout-session/${tourId}`
    );

    window.location.href = session.data.session.url;
  } catch (err) {
    console.error('❌ Error in bookTour function:', err);
    showAlert('error', 'Something went wrong! Please try again.'); // ✅ Ensure showAlert exists
  }
};
