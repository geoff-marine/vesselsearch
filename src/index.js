import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';


const getSuggestionValue = suggestion => suggestion.vesselName;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div id = "app">
    Vessel Name:{suggestion.VesselName}<p>{suggestion.cfr} Country Code: {suggestion.CountryCode} &nbsp;
     Loa: {suggestion.Loa} &nbsp; Event Code: {suggestion.EventCode} &nbsp; Event End Date: {suggestion.EventEndDate}</p>
  </div>
);

class Example extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
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

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    axios
      .post('http://10.11.1.70:9200/allvessels/allevents/_search', 
      {
        "size":50,
        "query": {
          "match": {"VesselName.edgengram": value}
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
    };

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<Example />, rootElement)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
