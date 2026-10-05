import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL

const AllofficalLetter = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/letters/allofficalLetter/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('خطا در دریافت اطلاعات از سرور');
        }
        return response.json();
      })
      .then((data) => {
        setLetters(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={styles.center}>در حال بارگذاری مکتوب‌ها...</div>;
  if (error) return <div style={{ ...styles.center, color: 'red' }}>خطا: {error}</div>;

  return (
    <div style={styles.container} dir="rtl">
      <h2 style={styles.title}>لیست تمام مکتوب‌های رسمی (د رسمي مکتوبونو لړلیک)</h2>
      
      <div style={styles.tableResponsive}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>نمبر مسلسل (پرله پسې شمېره)</th>
              <th style={styles.th}>کد پیگیری (ترکینګ آی‌ډی)</th>
              <th style={styles.th}>مرجع هدف / گیرنده (ترلاسه کوونکی)</th>
              <th style={styles.th}>موضوع (سرلیک)</th>
              <th style={styles.th}>متن مکتوب (منځپانګه)</th>
              <th style={styles.th}>تاریخ ثبت (نېټه)</th>
            </tr>
          </thead>
          <tbody>
            {letters.map((letter, index) => (
              <tr key={letter.id || index} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                <td style={styles.td}>{index + 1}</td>
                <td style={{ ...styles.td, ...styles.code }}>{letter.tracking_id}</td>
                <td style={styles.td}>{letter.destination}</td>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>{letter.subject}</td>
                <td style={{ ...styles.td, ...styles.contentCell }}>{letter.content}</td>
                <td style={styles.td}>
                  {new Date(letter.created_at).toLocaleDateString('fa-AF', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const styles = {
  container: {
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    margin: '20px'
  },
  title: {
    color: '#333',
    marginBottom: '20px',
    borderBottom: '2px solid #0056b3',
    paddingBottom: '10px'
  },
  tableResponsive: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    textAlign: 'right'
  },
  th: {
    backgroundColor: '#0056b3',
    color: '#fff',
    padding: '12px 15px',
    fontSize: '14px',
    border: '1px solid #ddd'
  },
  td: {
    padding: '12px 15px',
    fontSize: '14px',
    border: '1px solid #ddd',
    color: '#444'
  },
  trEven: {
    backgroundColor: '#f2f2f2'
  },
  trOdd: {
    backgroundColor: '#fff'
  },
  code: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#666',
    direction: 'ltr',
    textAlign: 'left'
  },
  contentCell: {
    maxWidth: '300px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    fontSize: '18px',
    fontFamily: 'Tahoma'
  }
};

export default AllofficalLetter;
