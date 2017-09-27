class A {
  async test() {
    var a = await Promise.resolve('1');
    return a;
  }
}

async function xxx() {
  var a = new A();
  var b = await a.test();

  console.log(b);
}


xxx();


