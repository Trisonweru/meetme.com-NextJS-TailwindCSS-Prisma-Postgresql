export const LowerCase = (mySentence: string) => {
  const words = mySentence.split(' ');

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toLowerCase() + words[i].substr(1);
  }

  return words.join('-');
};
