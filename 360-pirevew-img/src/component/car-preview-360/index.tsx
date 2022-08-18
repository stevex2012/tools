import {
  FC,
  MouseEventHandler,
  ReactEventHandler,
  TouchEventHandler,
  useCallback,
  useEffect,
  useRef,
} from "react";
import styles from "./index.less";
import { isMobile } from "./utils";
// 第一期渲染方式采用 img 不同切换 src
// 第二期 使用 canvans 渲染方式，比图片渲染方式cpu占用率更低,图片方式还会产生大量请求

// 360度，10度，就是一个角度图

const baseRate = 4;

let lastRoateDeg = 0;

const IMGS_LISTS: HTMLImageElement[] = [];

export interface ICarPreview360 {
  /**
   * 图片要求 36xN 张，要求第一张是车身侧面，排序要求顺时针排序展示36xn个角度图片
   */
  carList: { img: string }[];
  firstImg?: string;
}

/**
 * @description 水平方向拖动360度展示一个物体的不同角度图片组件，
 * 使用实时改变图片url实现
 */
export const CarPreview360: FC<ICarPreview360> = ({
  carList,
  firstImg = carList[0].img,
}) => {
  const IMG_LEN = carList.length;

  const isMouseDown = useRef<boolean>(false);
  // startx
  const startXRef = useRef<number>(0);
  //canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const preoLoadAllImg = useCallback(() => {
    carList.forEach(({ img }) => {
      const preimg = document.createElement("img");
      IMGS_LISTS.push(preimg);
      preimg.onload = () => {};
      preimg.src = img;
    });
  }, []);

  useEffect(() => {
    preoLoadAllImg();
    return () => {
      // release
      IMGS_LISTS.length = 0;
    };
  }, []);

  const drawImg = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const w = canvas?.offsetWidth ? canvas?.offsetWidth : 0;
    const h = canvas?.offsetHeight ? canvas?.offsetHeight : 0;

    canvas?.setAttribute("width", `${w}`);

    canvas?.setAttribute("height", `${h} `);
    ctx?.drawImage(img, 0, 0, w, h);
  }, []);

  const handleFirstImgLoad = useCallback<ReactEventHandler<HTMLImageElement>>(
    (e) => {
      drawImg(e.target as HTMLImageElement);
    },
    [drawImg]
  );

  // 根据滑动的 x 的距离，计算显示的角度

  const handleStart = useCallback((pageX: number) => {
    startXRef.current = pageX;
    isMouseDown.current = true;
  }, []);

  const handleMove = useCallback(
    (pageX: number) => {
      if (isMouseDown.current) {
        const moveX = pageX - startXRef.current;
        const roateDeg = moveX / baseRate + lastRoateDeg;
        const baseIdx = Math.floor(roateDeg % IMG_LEN);
        const imgIdx = baseIdx > 0 ? IMG_LEN - baseIdx - 1 : Math.abs(baseIdx);

        try {
          drawImg(IMGS_LISTS[imgIdx]);
        } catch (error) {
          console.log("error", error);
        }
      }
    },
    [drawImg]
  );

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
      className={`${styles.wrap} ${styles.canvaswrap}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img src={firstImg} onLoad={handleFirstImgLoad} />
      <canvas ref={canvasRef} />
    </div>
  );
};
