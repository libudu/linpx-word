export const isScreenSmall = () => {
  return document.body.clientWidth < 1100;
};

export const downloadText = (content: string, fileName = 'script') => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  link.download = fileName + '.txt';
  link.style.display = 'none';
  link.href = URL.createObjectURL(blob,);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getChooseFileText = async () => {
  const [ fileHandler ] = await showOpenFilePicker({
    types: [
      {
        accept: {
          'text/*.txt': ['.txt']
        }
      },
    ],
    multiple: false,
  });
  const file = await fileHandler.getFile();
  const text = await file.text();
  return text;
};