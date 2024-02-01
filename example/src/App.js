import React from 'react'

import { WizChart } from '@lewislovejoy/reactchart'

const App = () => {
  return (
    <WizChart
      width={200}
      height={200}
      data={[
        { date: '2024/01/01', count: 21 },
        { date: '2024/01/02', count: 25 },
        { date: '2024/01/03', count: 19 },
        { date: '2024/01/04', count: 8 },
      ]}
      charts={[
        {
          "plots": [
            {
              "type": "Axis",
              "side": "bottom",
              "label": "date",
              "padding": 30,
              "patterns": [
                "date"
              ],
              "bounds": {
                "min": true,
                "max": true
              },
              "dataType": "date"
            },
            {
              "type": "Axis",
              "side": "left",
              "label": "count",
              "showGrid": true,
              "padding": 40,
              "patterns": [
                "count"
              ],
              "bounds": {
                "min": 0,
                "max": 30
              },
              "dataType": "linear"
            },
            {
              "type": "Line",
              "patternX": "date",
              "patternY": "count",
              "color": "#ff0000"
            },
            {
              "type": "Legend",
              "location": "left-top",
              "width": 100,
              "background": "white",
              "data": [
                {
                  "key": "date",
                  "name": "Date",
                  "color": "black",
                  "isDate": true
                },
                {
                  "key": "count",
                  "name": "Percent",
                  "color": "#ff000062"
                }
              ]
            }
          ]
        }
      ]}
    />
  )
}

export default App
