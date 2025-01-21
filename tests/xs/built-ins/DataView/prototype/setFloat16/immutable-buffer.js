/*---
features: [DataView, ArrayBuffer, Float16Array, immutable-arraybuffer]
---*/

var buffer = new ArrayBuffer(1);
var sample = new DataView(buffer.transferToImmutable(), 0);

assert.throws(TypeError, function() {
  sample.setFloat16(0, 0n);
});