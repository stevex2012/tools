import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect, useMemo } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
import "./App.css";
function MyEditor() {
  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法
  // const [editor, setEditor] = useState(null)                   // JS 语法

  // 编辑器内容
  const [html, setHtml] = useState("<p>hello useState 请求，异步设置</p><p>234234235235253</p>");

  // 模拟 ajax 请求，异步设置 html
  // useEffect(() => {
  //   setTimeout(() => {
  //     setHtml("<p>hello world</p>");
  //   }, 1500);
  // }, []);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {}; // TS 语法
  // const toolbarConfig = { }                        // JS 语法
  toolbarConfig.insertKeys = {
    index: 5,
    keys: ["menu1",'padding123'],
  };
  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    // TS 语法
    // const editorConfig = {                         // JS 语法
    placeholder: "请输入内容...",
    MENU_CONF:{}
  };
  editorConfig.onChange = (editor: IDomEditor) => {
    // console.log('change')
    // TS 语法
    // editorConfig.onChange = (editor) => {            // JS 语法
    // editor changed
  };

//   editorConfig.MENU_CONF['fontSize'] = {
//     fontSizeList: ['12px', '16px', '24px', '40px']
// }
  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  const memoPresetCss = useMemo(() => `<style>
    p{
      margin:0;
    }
    img{
      vertical-align: top;
    }
  </style>`, [])

  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={(editor) => {
          
            setHtml(editor.getHtml())
          }}
          mode="default"
          style={{ height: "500px", overflowY: "hidden" }}
          
        
        />
      </div>
      <div style={{ marginTop: "15px" }} dangerouslySetInnerHTML={{__html: `${memoPresetCss}${html}`}}></div>
    </>
  );
}

export default MyEditor;
