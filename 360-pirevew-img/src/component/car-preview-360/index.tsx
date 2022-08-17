import {
  FC,
  MouseEventHandler,
  TouchEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./index.less";
import { isMobile } from "./utils";

// 360度，10度，就是一个角度图

const baseRate = 4;

let lastRoateDeg = 0;

export interface ICarPreview360 {
  /**
   * 图片要求 36xN 张，要求第一张是车身侧面，排序要求顺时针排序展示36xn个角度图片
   */
  carList: { img: string }[];
}

/**
 * @description 水平方向拖动360度展示一个物体的不同角度图片组件，
 * 使用实时改变图片url实现
 */
export const CarPreview360: FC<ICarPreview360> = ({ carList }) => {
  const IMG_LEN = carList.length;

  const [imgSrc, setImgSrc] = useState<string>(carList[0].img);
  const isMouseDown = useRef<boolean>(false);
  // startx
  const startXRef = useRef<number>(0);

  const loadAllImg = useCallback(() => {
    carList.forEach(({ img }) => {
      const preimg = document.createElement("img");
      preimg.src = img;
    });
  }, []);

  useEffect(() => {
    //load all img
    loadAllImg();
  }, []);

  // 根据滑动的 x 的距离，计算显示的角度

  const handleStart = useCallback((pageX: number) => {
    startXRef.current = pageX;
    isMouseDown.current = true;
  }, []);

  const handleMove = useCallback((pageX: number) => {
    if (isMouseDown.current) {
      const moveX = pageX - startXRef.current;
      const roateDeg = moveX / baseRate + lastRoateDeg;
      const baseIdx = Math.floor(roateDeg % IMG_LEN);
      const imgIdx = baseIdx > 0 ? IMG_LEN - baseIdx - 1 : Math.abs(baseIdx);

      try {
        setImgSrc(carList[imgIdx].img);
      } catch (error) {}
    }
  }, []);

  const handleEnd = useCallback((pageX: number) => {
    const moveX = pageX - startXRef.current;
    const roateDeg = moveX / baseRate;
    lastRoateDeg = lastRoateDeg + roateDeg;
    isMouseDown.current = false;
  }, []);

  const handleMouseDown = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      if (!isMobile()) handleStart(e.pageX);
    },
    [handleStart]
  );

  const handleTouchStart = useCallback<TouchEventHandler<HTMLDivElement>>(
    (e) => {
      if (isMobile()) handleStart(e.touches[0].pageX);
    },
    [handleStart]
  );

  const handleMouseMove = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      if (!isMobile()) {
        handleMove(e.pageX);
      }
    },
    [handleMove]
  );

  const handleTouchMove = useCallback<TouchEventHandler<HTMLDivElement>>(
    (e) => {
      if (isMobile()) handleMove(e.touches[0].pageX);
    },
    [handleMove]
  );

  const handleMouseUp = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      if (!isMobile()) {
        handleEnd(e.pageX);
      }
    },
    [handleEnd]
  );

  const handleTouchEnd = useCallback<TouchEventHandler<HTMLDivElement>>(
    (e) => {
      if (isMobile()) handleEnd(e.changedTouches[0].pageX);
    },
    [handleEnd]
  );

  return (
    <div
      className={styles.wrap}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img src={imgSrc} />
    </div>
  );
};
