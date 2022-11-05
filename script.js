const text = `

`;

const processText = () => {
  const arr = text.split(/\r?\n/);
  const obj = {};
  arr.forEach((field) => {
    const [key, value] = field.split(': ');
    obj[key.toLowerCase().replaceAll(' ', '_')] = value;
  });
  console.log(JSON.stringify(obj));
  console.log(JSON.stringify(arr));
};

processText();
