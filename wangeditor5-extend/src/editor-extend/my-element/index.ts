import { DomEditor, IDomEditor,SlateElement,SlateTransforms } from '@wangeditor/editor'
import { h, VNode } from 'snabbdom'
// import {renderElement} from '@wangeditor/editor/dist/editor'


export function withAttachment<T extends IDomEditor>(editor: T) {  // TS 语法
// function withAttachment(editor) {                        // JS 语法
  const { isInline, isVoid,insertBreak } = editor
  const newEditor = editor

  newEditor.insertBreak = () => {
        // if: 是 ctrl + enter ，则执行 insertBreak
        console.log('----',insertBreak)
        
        insertBreak()
            // 新开一行
        // else: 则不执行换行
        return
    }

  newEditor.isInline = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'attachment') return false // 针对 type: attachment ，设置为 inline
    return isInline(elem)
  }

  newEditor.isVoid = elem => {
    const type = DomEditor.getNodeType(elem)
    if (type === 'attachment') return true // 针对 type: attachment ，设置为 void
    return isVoid(elem)
  }
  

  return newEditor // 返回 newEditor ，重要！！！
}

export function renderAttachment(elem: SlateElement, children: VNode[] | null, editor: IDomEditor): VNode {  // TS 语法
// function renderAttachment(elem, children, editor) {                                                // JS 语法

    // 获取“附件”的数据，参考上文 myResume 数据结构
    console.log('--children',children)
    console.log('--elem',elem)
    console.log('--elem children',elem?.children[0])
    // 拿到
    // 附件 icon 图标 vnode
    const iconVnode = h(
        // HTML tag
        'span',
        // HTML 属性
        {
            props: { src: 'xxxx.png',text: '21312' }, // HTML 属性，驼峰式写法
            style: { width: '1em', marginRight: '0.1em', } // HTML style ，驼峰式写法
        },
        // img 没有子节点，所以第三个参数不用写
        [h]
    )

    // 附件元素 vnode
    const attachVnode = h(
        // HTML tag
        'div',
        // HTML 属性、样式、事件
        {
            props: { contentEditable: true }, // HTML 属性，驼峰式写法
            style: { 
                display: 'block',
                // border:'1px solid red',
                backgroundColor:'#ddd',
                 height:elem?.paddingTop || '0',
                  /* 其他... */ }, // style ，驼峰式写法
            on: { click() { console.log('clicked') }, /* 其他... */ }
        },
        // 子节点
        
    )

    return attachVnode
}


/**
 * 生成“附件”元素的 HTML
 * @param elem 附件元素，即上文的 myResume
 * @param childrenHtml 子节点的 HTML 代码，void 元素可忽略
 * @returns “附件”元素的 HTML 字符串
 */
export function attachmentToHtml(elem: SlateElement, childrenHtml: string): string {  // TS 语法
// function attachmentToHtml(elem, childrenHtml) {                             // JS 语法

  // 获取附件元素的数据
  const { paddingTop } = elem
  // 生成 HTML 代码
  const html = `<div style="height:${paddingTop}"></div>`

  return html
}