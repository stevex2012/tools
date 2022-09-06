import {
  IButtonMenu,
  IDomEditor,
  Boot,
  IModuleConf,
  SlateEditor,
  SlateElement,
  SlateNode,
} from "@wangeditor/editor";

class MyButtonMenu implements IButtonMenu {
  // TS 语法
  // class MyButtonMenu   {                       // JS 语法
  readonly title = '格式刷'
  readonly tag = 'button'
 // 标志位，格式刷上是否有样式
  private hasFormateStyle: boolean = false;
  private formatStyle: Record<string,any> = {}
  private editor:IDomEditor;


  constructor(editor:IDomEditor) {
    // super();
    // this.iconSvg = '<svg>...</svg>' // 可选

    // editor.on('click',()=>{
    //   console.log('click')
    // })
    // 监听 mouse 
    console.log(editor)
    this.editor = editor;
    this.initMouseEvent();
  }

  handleFormate(){
    if(this.hasFormateStyle){
      console.log('do formate style')
      Object.keys(this.formatStyle).forEach(key=>{
        this.editor.addMark(key,this.formatStyle[key])
      })
      this.formatStyle = {};
      this.setFlag(false)
    }
  }

  initMouseEvent(){
    // 点击也会执行
    
    document.body?.addEventListener('mouseup',()=>{
      try {
        
        const len = this.editor.getSelectionText().trim().length;
        // const style = this.getSelectionNodesStyle(this.editor);
        len && this.handleFormate();
      } catch (error) {
        
      }
    })
  }



  // 监听 mouse 

  // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
  getValue(editor: IDomEditor): string | boolean {
    // TS 语法
    // getValue(editor) {                              // JS 语法
    return " hello ";
  }

  // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
  isActive(editor: IDomEditor): boolean {
    // TS 语法
    // isActive(editor) {                    // JS 语法
    return false;
  }

  // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
  isDisabled(editor: IDomEditor): boolean {
    // TS 语法
    // isDisabled(editor) {                     // JS 语法
    return false;
  }

  // get styles 
  getStyles(els:Record<string, any>[],selecteText?: string):Record<string, any>{
    return els.reduce((res,item)=>{
      Object.keys(item).forEach(key=>{
        if(key !== 'text' && selecteText === item.text){
          res[key] = item[key];
        }
      })
      return res;
    },{})
  }

  // 选中节点样式
  getSelectionNodesStyle(editor:IDomEditor){
    const nodeEntries = SlateEditor.nodes(editor, {
        match: (node: SlateNode) => {
          // TS syntax
          // match: (node) => {          // JS syntax
          if (SlateElement.isElement(node)) {
            console.log('--node',node)
            // if (node.type === "paragraph") {
            //   return true; // 匹配 paragraph
            // }
              return true; // 匹配 paragraph

          }
          return false;
        },
        universal: true,
      });

      let styles = {}
      const selecteText = editor.getSelectionText();
      console.log('selecteText',selecteText)

      if (nodeEntries == null) {
        console.log("当前未选中的 paragraph");
      } else {
        for (let nodeEntry of nodeEntries) {
          const [node, path] = nodeEntry;
          console.log("选中了 paragraph 节点", node);
          // 获取节点数据，监听mouche
          styles = this.getStyles(node?.children || [],selecteText);
          

          console.log("节点 path 是", path);
          console.log("style", styles);
        }
      }

      return styles;
  }

  // 点击菜单时触发的函数
  exec(editor: IDomEditor, value: string | boolean) {
    this.editor = editor;
    // TS 语法
    // exec(editor, value) {                              // JS 语法
    // if (this.isDisabled(editor)) return;
    // editor.insertText(value); // value 即 this.value(editor) 的返回值
    // 1 判断是否有选中
    // console.log("this.", editor.selection);
    if (editor.getSelectionText().trim().length) {
      // this.getSelectionNodesStyle(editor)
      this.formatStyle = this.getSelectionNodesStyle(editor)
      this.setFlag(this.emptyObj(this.formatStyle))
    }
  }

  emptyObj(obj:Record<string,any>){
    return !!Object.keys(obj).length;
  }

  setFlag(bool:boolean){
    this.hasFormateStyle = bool;
  }
}

export { MyButtonMenu };
