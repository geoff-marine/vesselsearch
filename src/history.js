import React from 'react';
import './index.css';
import axios from 'axios';


const getCFRValue = historySuggestions => historySuggestions.CFR;

// Use your imagination to render suggestions.
const renderHistory = historySuggestions => (
    <div>
         <b>event:</b>{historySuggestions.EventCode}<p>Event Start Date: {historySuggestions.EventStartdate} &nbsp;
         Event End Date: {historySuggestions.EventEndDate}</p>
    </div>
);

class History extends React.Component {
    constructor() {
      super();
  
      this.state = {
        valueCFR: '',
        historySuggestions: []
      };
    }
 
 
    onClickFetchHistoryChange = (event, { newvalueCFR }) => {
       this.setState({
          valueCFR: newvalueCFR
       });
     };
    
     onClickFetchHistory = ({ valueCFR }) => {
       axios
         .post('http://10.11.1.70:9200/allvessels/allevents/_search', 
          {
             "query": { "match": {"cfr": valueCFR} }
          }
         )
         .then(res => {
           const historyResults = res.data.hits.hits.map(h => h._source)
           this.setState({ historySuggestions: historyResults })
         })
     }
     onclickHistoryfetchClear = () => {
       this.setState({
          historySuggestions: []
       });
     };
 
     render() {
        const { valueCFR, historySuggestions } = this.state;
       return 

       }
    };

    export default History; 
