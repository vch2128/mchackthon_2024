import React from 'react';

type ImageComponentProps = {
  src: string;
};

const ImageComponent: React.FC<ImageComponentProps> = ({ src }) => {
  return <img src={src} />;
};

export default ImageComponent;
