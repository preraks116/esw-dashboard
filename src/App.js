import React from 'react';
import Plot from 'react-plotly.js';

class App extends React.Component {
  render() {
    return (
      <div id="ESW_Dashboard">
        Hello World
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
          {type: 'line', x: [1, 2, 3], y: [2, 5, 3]},
          {type: 'line', x: [1, 2, 3], y: [2, 7, 3]},
        ]}
        layout={ {width: 320, height: 240, title: 'A Fancy Plot'} }
      />
      </div>
    );
  }
}

export default App;
