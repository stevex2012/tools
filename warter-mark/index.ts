interface IaddPageWaterMark{
    // 水印文字
    text:string
    // 文字字体大小 default: 12
    fontSize?: number;
    // 字体 default： 宋体
    fontFamily?: string;
    // 水印父级盒子el default: body
    parentEl?:HTMLElement;
    // 水印颜色 default: rgba(0, 0, 0, .1)
    color?: string;
    // 水印图片宽度
    canvasWidth?: number;
    // 水印图片高度
    canvasHeight?: number;
    // 倾斜角度  传入整数 default:-20*Math.PI / 180 
    rotateDeg?: number;
}

((window)=>{
  const clsName = 'stevelalala'
    const textToImg = ({text, fontSize = 12,color = "rgba(0, 0, 0, .1)", canvasWidth, canvasHeight, fontFamily = '宋体'}:IaddPageWaterMark) => {
      const heightRate = 10;
      const widthRate = 1;
      const textLen = text.length;
      // const rotateRate = -20;
      // const roateDegree = (rotateDeg * Math.PI) / 180
      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth || textLen * fontSize * widthRate; // 15 是字体大小
      canvas.height = canvasHeight || fontSize * heightRate;
    
      const ctx = canvas.getContext("2d");
      if(ctx){
            ctx.textAlign = "center";
          // ctx.fillStyle = "rgba(255, 255, 255, 0)"; // 设置白笔
          // ctx.fillRect(0, 0, canvas.width, canvas.height); //白色背景
          // ctx.rotate(roateDegree);
        
          ctx.font = ` ${fontSize}px ${fontFamily}`; // 字号
          ctx.fillStyle = color;
            ctx.fillText(text, canvas.width / 2, canvas.height / 2); // 设置黑笔
          // ctx.fillText(text, (canvas.width / 5) * 1, canvas.width / 3); // 设置黑笔
          // ctx.fillText(text, (canvas.width / 5) * 1, canvas.width / 2); // 设置黑笔
          //   ctx.rotate((-45 * Math.PI) / 180);
            // document.body.append(canvas);
      }
      return canvas.toDataURL("image/png");
    };


    function CaevRemoveWaterMark({parentEl = document.body}:Pick<IaddPageWaterMark,'parentEl'> = {}){
      if(parentEl){
        (parentEl as any)?.querySelector(`#${clsName}`)?.remove();
      }
    }
    
    
    const addPageWaterMark = ({
        parentEl = document.body,
        rotateDeg = -30,
        ...rest
    }:IaddPageWaterMark) => {
      function removeDiv(id:string) {
        try {
          const el = (parentEl as any).querySelector(`#${id}`);
          el?.remove();
        } catch (error) {}
      }
      removeDiv(clsName);
    
      parentEl.style.position = 'relative'

      const img = textToImg({...rest});
    
      const div = document.createElement("div");
      div.id = clsName;
      div.setAttribute('class', clsName)
      const innderDiv = document.createElement('div')
      //   transform: translate(-50%, -50%) rotate(-20deg);
      div.style.cssText = `
        pointer-events: none;
        position: absolute;
        left: 0;
        top: 0;
        right:0;
        bottom:0;
        z-index:9999999999;
        overflow: hidden;
      `;

      innderDiv.style.cssText = `
        pointer-events: none;
        position: absolute;
        left: 50%;
        top: 50%;
        width: 200%;
        height: 200%;
        background: url(${img});
        transform: translate(-50%, -50%) rotate(${rotateDeg}deg)
      `
      div?.appendChild(innderDiv)
      parentEl?.appendChild(div);
      return 
    };
    if((window as any)?.CaevAddPageWaterMark){
        throw Error('初始化失败')
    }else{
        (window as any).CaevAddPageWaterMark = addPageWaterMark;
    }
    (window as any).CaevRemoveWaterMark = CaevRemoveWaterMark
    // 清除
})(window)

