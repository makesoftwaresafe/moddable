/*---
includes: [testTypedArray.js]
features: [TypedArray, immutable-arraybuffer]
---*/

var obj = {};
Object.defineProperty(obj, "length", {
  get: function() {
    throw new Test262Error();
  }
});

testWithTypedArrayConstructors(function(TA) {
  var buffer = new ArrayBuffer(2 * TA.BYTES_PER_ELEMENT);
  var sample = new TA(buffer.transferToImmutable());
  assert.throws(TypeError, function() {
    sample.set([1]);
  });

  assert.throws(TypeError, function() {
    sample.set(obj);
  }, "before Get(src.length)");
});
