var test = require('unit.js');

describe('Learning an example', function()
{
    it ('example variable', function()
    {
        var example = "hello world";

        test
            .string(example)
                .startsWith('hello')
                .match(/[a-z]/)

            .given(example = 'you are welcome')
                .string(example)
                .endsWith('welcome')
                .contains('you')

            .when('"example" becomes an object', function(){
                
                example = {
                    message: 'hello world',
                    name: 'Branden',
                    job: 'developer',
                    from: 'Florida'
                };
            })

            .then('test the "example" object', function(){

                test
                    .object(example)
                        .hasValue('developer')
                        .hasProperty('name')
                        .hasProperty('from', 'Florida')
                        .contains({message: 'hello world'})
                ;
            })

            .if(example = 'bad value')
                .error(function(){
                    example.badMethod();
                })
            ;
    })
})