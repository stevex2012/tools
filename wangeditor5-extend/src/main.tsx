import { IModuleConf, Boot } from "@wangeditor/editor";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MyButtonMenu } from "./editor-extend/my-button-menu";
import { attachmentToHtml, renderAttachment, withAttachment } from "./editor-extend/my-element";
import { MySelectMenu } from "./editor-extend/padding";
import "./index.css";

const menu1Conf = {
  key: "menu1", // 定义 menu key ：要保证唯一、不重复（重要）
  factory() {
    return new MyButtonMenu(); // 把 `YourMenuClass` 替换为你菜单的 class
  },
};
const paddingConf = {
  key: "padding123", // 定义 menu key ：要保证唯一、不重复（重要）
  factory() {
    return new MySelectMenu(); // 把 `YourMenuClass` 替换为你菜单的 class
  },
};

const module: Partial<IModuleConf> = {
  // TS 语法
  // const module = {                      // JS 语法

  menus: [paddingConf,menu1Conf],

  // 其他功能，下文讲解...
};
// Boot.registerMenu(paddingConf)
Boot.registerModule(module);

Boot.registerPlugin(withAttachment)

const renderElemConf = {
  type: 'attachment', // 新元素 type ，重要！！！
  renderElem: renderAttachment,
  elemToHtml: attachmentToHtml,
}

const elemToHtmlConf  = {
  type: 'attachment', // 新元素 type ，重要！！！
  elemToHtml: attachmentToHtml,
}

Boot.registerRenderElem(renderElemConf)
Boot.registerElemToHtml(elemToHtmlConf)

Boot.registerRenderStyle((node,vnode)=>{
  const baseStyle = vnode.data?.style || {};
  if(node?.type === 'paragraph'){
     vnode.data.style = {
    ...baseStyle,
    paddingTop:node?.paddingTop || 0,
  }
  }
 
  return vnode;
})

Boot.registerStyleToHtml((node, elemHtml)=>{
  let html = elemHtml
   if(node?.type === 'paragraph'){
      html = `<div style="padding-top:${node?.paddingTop || 0}">${elemHtml}</div>`
  }
  return html
})




ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

