import React from 'react';
import './index.css';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';



const getSuggestionValue = suggestion => suggestion.vesselName;

const renderSuggestion = suggestion => (
  <div id = "app">
    <b>Vessel Name:</b>{suggestion.VesselName}<p>{suggestion.cfr} Country Code: {suggestion.CountryCode} &nbsp;
     Loa: {suggestion.Loa}</p>
     <p></p>
  </div>
);

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };
  }


  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    axios
      .post('http://10.11.1.70:9200/vessel/mostrecentcfr/_search', 
      {
        "size":50,
        "query": {
        	"bool": {
        		"must": {
          "multi_match" : {
            "query":  value, 
            "fields": [ "VesselName.trigram", "ExactName^10" ],
            "fuzziness": "AUTO"
          }
          },
          "should":[{"match":{"CountryCode": "IRL"}}],

		    }
       }
    }
      )
      .then(res => {
        const results = res.data.hits.hits.map(h => h._source)
        this.setState({ suggestions: results })
      })
  }

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };


 


  render() {
    const { value, suggestions } = this.state;
    
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Check Vessel Name',
      value,
      onChange: this.onChange
    }
    ;

    // Finally, render it!
    return (
      
      <div>
      <Autosuggest
          
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}       
      />
      </div>
      
      
    );
  }
}

export default App;