## Overview

A very simple React Chart library - tbh, 
a vanity project due to the amount of complexity and number of times I needed to find a work-around 
for some 'clever' code that didn't fit my use case, including:


- Interaction issues - like Click and Hover
- Render issues - like Combining multiple charts

So this is a simple chart library, coded in a day long Hackathon, that uses the 
concept of a JSON manifest to define a chart and then add data to it.

I've open sourced it here in-case anyone finds it useful to copy/paste 
parts of it for their own use 

## Install

Just npm install (or yarn etc..):

```bash
npm install --save github:lewislovejoy/reactchart
```

## Starting Development

Just import the Chart component:

```javascript
import { WizChart } from '@lewislovejoy/reactchart';
```

and then use it

```javascript
<WizChart
  data={chart_data}
  charts={chart_config}
  onClickFn={(point) => {}}
  selected={some_point}
  setSelected={(point) => {}}
  disableAnimation
/>
```

Chart config then needs to follow this JSON format:

```json
{
  
}
```

and chart data is any JSON array:

```json
[
  {
    "a": 1,
    "b": 2
  }
]
```

## Docs

None, sorry

## Maintainers

- Lewis Lovejoy https://github.com/lewislovejoy

## License

GNU GENERAL PUBLIC LICENSE
