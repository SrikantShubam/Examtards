import { useState, useEffect } from 'react';
import axios from 'axios';

function ExamDetail({ match }) {
  const [examDetail, setExamDetail] = useState(null);

  useEffect(() => {
    const fetchExamDetail = async () => {
      try {
        const response = await axios.get(`/api/exam-detail/${match.params.examName}`);
        setExamDetail(response.data);
      } catch (error) {
        console.error('Error fetching exam detail:', error);
      }
    };
    fetchExamDetail();
  }, [match.params.examName]);

  return (
    <div>
     hello boys
    </div>
  );
}

export default ExamDetail;



