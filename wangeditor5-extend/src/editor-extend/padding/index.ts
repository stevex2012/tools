/**
 * 自定义段前段后距离
 * 
 */

import { IDomEditor, ISelectMenu,SlateEditor,SlateElement,SlateNode,SlateTransforms  } from '@wangeditor/editor'

export class MySelectMenu implements ISelectMenu {   // TS 语法
// class MySelectMenu {                       // JS 语法

    readonly title = '段前距离'
    readonly tag = 'select'

    constructor() {
        // super(editor);
    //   this.title = '段前距离',
    //   this.tag = 'select'
    //   this.width = 60;
    //   this.editor = editor;
      
    }
    

    // 下拉框的选项
    getOptions(editor: IDomEditor) {   // TS 语法
    // getOptions(editor) {            // JS 语法
        const options = [
          { value: 'select-menu', text: '段前距离',styleForRenderMenuList: {display: 'none'} },
          { value: '0', text: '0' },
          { value: '5', text: '5', },
          { value: '10', text: '10' }
        ]
        return options
    }

    // 菜单是否需要激活（如选中加粗文本，“加粗”菜单会激活），用不到则返回 false
    isActive(editor: IDomEditor): boolean {    // TS 语法
    // isActive(editor) {                      // JS 语法
        return false
    }

    // 获取菜单执行时的 value ，用不到则返回空 字符串或 false
    getValue(editor: IDomEditor): string | boolean {    // TS 语法
    // getValue(editor) {                               // JS 语法
        return 'select-menu' // 匹配 options 其中一个 value
        // return false // 匹配 options 其中一个 value
    }

    // 菜单是否需要禁用（如选中 H1 ，“引用”菜单被禁用），用不到则返回 false
    isDisabled(editor: IDomEditor): boolean {   // TS 语法
    // isDisabled(editor) {                     // JS 语法
        return false
    }

    getAllSelections(editor){
        const nodeEntries = SlateEditor.nodes(editor, {
    match: (node: SlateNode) => {  // TS syntax
    // match: (node) => {          // JS syntax
        if (SlateElement.isElement(node)) {
            if (node.type === 'paragraph') {
                return true // 匹配 paragraph
            }
        }
        return false
    },
    universal: true,
})

if (nodeEntries == null) {
    console.log('当前未选中的 paragraph')
} else {
    for (let nodeEntry of nodeEntries) {
        const [node, path] = nodeEntry
        console.log('选中了 paragraph 节点', node)
        console.log('节点 path 是', path)
    }
}
    }

    // 点击菜单时触发的函数
    exec(editor: IDomEditor, value: string | boolean) {   // TS 语法
    // exec(editor, value) {                              // JS 语法
        // Select menu ，这个函数不用写，空着即可
        // console.log(first)
        // 获取select ，增加pading
        const node = { type: 'attachment', children: [{ text: '', }],lineHeight: '3',fontSize:'18px', paddingTop: `${value}px`}

        // editor.insertNode(node)
        // const 
        // const emptyNode = {
        //       type: 'paragraph', children: [{ text: '' }] 
        // }
        // editor.insertNode(emptyNode)

        // setTimeout(() => {
        //     this.getAllSelections(editor)
        // }, 2000);
        // this.getAllSelections(editor)


        // const element = {
        //     type: 'attachment',
        //     children:[{text: ''}],
        //     paddingTop: `${value}px`
        // }

        // SlateTransforms.wrapNodes(editor,element)
        SlateTransforms.setNodes(editor, {
                paddingTop: `${value}px`
            }, {
            mode: 'highest' // 针对最高层级的节点
            })

    }

}