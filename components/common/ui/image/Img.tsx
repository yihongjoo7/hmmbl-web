import Image from 'next/image';

export interface ImgProps {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
  className?: string;
}
/**
 *
 * @param {
 *  src: string; // public/images 하단 경로 (예: /icons/common/btn_clear.svg)
 *  width?: number; // 이미지 width (defult: 28)
 *  height?: number; // 이미지 height (defult: 28)
 *  alt?: string; // 이미지 설명 (defult: '이미지')
 *  className?: string;
 * }
 */
export default function Img(props: ImgProps) {
  const { src, className, width = 28, height = 28, alt = '이미지' } = props;

  return (
    <Image src={`/images${src}`} className={className} width={width} height={height} alt={alt} />
  );
}
