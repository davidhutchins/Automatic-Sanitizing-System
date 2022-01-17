import React from 'react';
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, LabelList} from 'recharts';
import './data.css'

const data = [
  { name: 'Sanitizer X', value: 3 },
  { name: 'The Seventh Ring', value: 4 },
  { name: 'Jims Office', value: 5 },
  { name: 'Swamp Office', value: 6 },
  { name: 'Korgs', value: 7 },
  { name: 'Borgs', value: 8 },
];


const ldata = [
  {
    name: "Mon",
    sanitizations: 10
  },
  {
    name: "Tues",
    sanitizations: 10
  },
  {
    name: "Wed",
    sanitizations: 20
  },
  {
    name: "Thurs",
    sanitizations: 40
  },
  {
    name: "Fri",
    sanitizations: 50
  },
  {
    name: "Sat",
    sanitizations: 60
  },
  {
    name: "Sun",
    sanitizations: 110
  }
];
export default function Data() {

  return (
    <section id = "datacntr">
      <div id="toplvlhead">
      <h1>Sanitizer Data</h1>
      </div>
      <div id = "desc1">
        <h1>Sanitizings Per Device</h1>
      </div>
      <div id="pie">
        <PieChart width={440} height={340}>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={data}
            cx={200}
            cy={200}
            outerRadius={80}
            fill="#5E9A50"
            label/>
          <Tooltip />
        </PieChart>
      </div>
<div id = "desc">
        <h1>Operations Over The Week</h1>
</div>
      <div id="line">
      <LineChart
        width={440}
        height={340}
        data={ldata}
        margin={{
          top: 40,
          right: 0,
          left: 0,
          bottom: 0
        }}>
          
      <CartesianGrid stroke="#ccc" strokeDasharray="1 1"  />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="sanitizations"
        stroke="#5E9A50"
        activeDot={{ r: 10 }}
      />
    </LineChart>
  </div>
        </section>
  );
     

    
  
   
  
}


