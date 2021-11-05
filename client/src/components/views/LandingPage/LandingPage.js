import React, { useEffect } from 'react';
import axios from 'axios';

const LandingPage = () => {
  //▼ 랜딩페이지에 오자마자 실행되는 함수
  useEffect(() => {
    // get 요청을 서버에 보내는 중
    axios.get('http://localhost:5000/api/hello')
      .then(response => console.log('response.data'));

  }, []);


  return (
    <div>
      LandingPage
    </div>
  );
};

export default LandingPage;
