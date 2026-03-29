import React, { useMemo, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './student.css';

const OTP_LENGTH = 6;

const StudentOTP = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));

  const maskedEmail = useMemo(() => {
    const payload = sessionStorage.getItem('student_login_payload');
    if (!payload) return 'su****@uni.edu';
    try {
      return JSON.parse(payload).maskedEmail || 'su****@uni.edu';
    } catch (error) {
      return 'su****@uni.edu';
    }
  }, []);

  const handleOtpChange = (index, value) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = clean;
    setOtp(next);

    if (clean && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    navigate('/student/feed');
  };

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="st-shell">
      <div className="st-mobile-frame">
        <header className="st-topbar" style={{ borderBottom: 'none' }}>
          <button className="st-icon-btn" onClick={() => navigate('/student/login')}>
            <ArrowLeft size={28} />
          </button>
          <h2 style={{ margin: 0, fontSize: 22, color: '#0b1430' }}>CampusConnect</h2>
          <span style={{ width: 36 }} />
        </header>

        <main className="st-auth-main" style={{ paddingTop: 8 }}>
          <h1 className="st-otp-title">Verify your email</h1>
          <p className="st-otp-sub">We sent a verification code to <strong style={{ color: '#0f172a' }}>{maskedEmail}</strong></p>

          <div className="st-otp-grid">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                inputMode="numeric"
              />
            ))}
          </div>

          <button className="st-primary-btn" onClick={handleVerify}>Verify</button>
          <button className="st-secondary-btn" onClick={handleResend}>Resend OTP</button>
        </main>

        <Link className="st-skip-link" to="/student/feed">Skip for now</Link>
      </div>
    </div>
  );
};

export default StudentOTP;