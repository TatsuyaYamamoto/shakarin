// var assert = require('assert');
// var target = require('../../src/js/content.js');
// var target = require('../target.js');



describe('contents.js', function(){
	describe('getcontents', function(){
		it('image', function(){
			assert
		})
	})
})

describe('Number', function() {  
    describe('calc', function() {
        it('add', function() {
            assert(4+8 == 12);
        });
        it('sub', function() {
            assert(4-8 == -4);
        });
        it('mul', function() {
            assert(16*2 == 32);
        });
        it('div', function() {
            assert(8/2 == 4);
        });
    });
});

describe('Array', function() {  
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            var arr = [1, 2, 3];
            assert(arr.indexOf(3) == 2);
            assert(arr.indexOf(5) ==-1);
            assert(arr.indexOf(0) ==-1);
        });
    });
});