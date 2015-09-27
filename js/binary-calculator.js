function calculate(n1, n2, o) {
  var num1 = parseInt(n1,2);
  var num2 = parseInt(n2,2);
  switch (o) {
  case 'add':
    return (num1 + num2).toString(2);
  case 'subtract':
    return (num1 - num2).toString(2);
  case 'multiply':
    return (num1 * num2).toString(2);
  default:
    return null;
  }
}

Test.assertEquals(calculate('1', '1', 'add'), '10');
Test.assertEquals(calculate('111', '101', 'add'), '1100');
Test.assertEquals(calculate('0', '11', 'add'), '11');
Test.assertEquals(calculate('111', '11', 'subtract'), '100');
Test.assertEquals(calculate('1', '1', 'subtract'), '0');
Test.assertEquals(calculate('1', '11', 'subtract'), '-10');
Test.assertEquals(calculate('1', '-11', 'add'), '-10');
Test.assertEquals(calculate('1', '1', 'multiply'), '1');
Test.assertEquals(calculate('-1', '1', 'multiply'), '-1');
Test.assertEquals(calculate('-1', '-1', 'multiply'), '1');
Test.assertEquals(calculate('0', '1111', 'multiply'), '0');
Test.assertEquals(calculate('0', '0', 'multiply'), '0');
Test.assertEquals(calculate('-100', '11', 'multiply'), '-1100');
Test.assertEquals(calculate('11', '11', 'multiply'), '1001');
