import { carList } from "../../data/index";
import styles from "./index.less";
import { CarPreview360 } from "@/component/car-preview-360";

// 如果是动态请求图片，
// 图片是动态加载，还需要考虑图片加载失败的情况
// 每次move 需要合并上次的 move 的状态。
//
export default function HomePage() {
  return <CarPreview360 carList={carList} />;
}
