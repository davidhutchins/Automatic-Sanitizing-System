var test = require('unit.js');

let data = [
  {
      day: "Sun",
      sanitizations: 10
  },
  {
      day: "Mon",
      sanitizations: 100
  },
  {
      day: "Tues",
      sanitizations: 90
  },
  {
      day: "Wed",
      sanitizations: 60
  },
  {
      day: "Thurs",
      sanitizations: 30
  },
  {
      day: "Fri",
      sanitizations: 200
  },
  {
      day: "Sat",
      sanitizations: 80
  }
];

describe('Reading from database and displaying data on a line graph', function()
{
    it ('Data collection check correct properties', function()
    {

        for (var i = 0; i < data.length; i++)
        {
            test
                .object(data[i])
                    .hasProperty('day')
                    .hasProperty('sanitizations')            
                
                .if(data[i] = 'bad value')
                    .error(function(){
                        data.badMethod();
                    })
                ;
        }
    })
    
    it ('Data collection check correct number of values', function(){
        test.assert(data.length === 7);
    })
})