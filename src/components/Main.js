require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片相关数据
var imageDatas = require('../data/imageDatas.json');

//利用自执行函数,将图片名信息转成图片url路径信息
imageDatas = (function genImageURL(imageDatasArr) {
  for (var i = 0, j = imageDatasArr.length; i < j; i++) {
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDatasArr[i] = singleImageData;
  }

  return imageDatasArr;
})(imageDatas);

// 获取区间内的一个随机值
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

var ImgFigure = React.createClass({

  render(){
    var styleObj = {};

    //如果props属性中指定了这张图片的位置,则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;

    }

    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
});

var GalleryByReactApp = React.createClass({
  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    }
  },

  // 重新布局所有图片
  rearrange: function (centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr;
    var Constant = this.Constant;
    var centerPos = Constant.centerPos;
    var hPosRange = Constant.hPosRange;
    var vPosRange = Constant.vPosRange;
    var hPosRangeLeftSecX = hPosRange.leftSecX;
    var hPosRangeRightSecX = hPosRange.rightSecX;
    var hPosRangeY = hPosRange.y;
    var vPosRangeTopY = vPosRange.topY;
    var vPosRangeX = vPosRange.x;

    var imgsArrangeTopArr = [];
    var topImgNum = Math.ceil(Math.random() * 2);

    // 取一个或不取,放在上册区域
    var topImgSpliceIndex = 0;
    var imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 居中图片信息
    imgsArrangeCenterArr[0].pos = centerPos;

    // 取出要在上侧的图片状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index].pos = {
        top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
      }
    });

    //左右两侧的图片

    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;

      //前半部分在左边,后半部分在右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i].pos = {
        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
      }
    }

    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })

  },

  rearrange:function (centerIndex) {

  },

  getInitialState: function () {
    return {
      imgsArrangeArr: []
    };
  },

  // 平台大小
  componentDidMount: function () {
    var stageDOM = this.refs.stage;
    var stageW = stageDOM.scrollWidth;
    var stageH = stageDOM.scrollHeight;
    var halfStageW = Math.ceil(stageW / 2);
    var halfStageH = Math.ceil(stageH / 2);

    // imageFigure大小
    var imgFigureDOM = this.refs.imgFigure0;

    var imgW = imgFigureDOM.scrollWidth;
    var imgH = imgFigureDOM.scrollHeight;
    var halfImgW = Math.ceil(imgW / 2);
    var halfImgH = Math.ceil(imgH / 2);
    // 计算中心图片位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    this.Constant.vPosRange.topY[0] = -halfImgH;

    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);

  },

  render: function () {

    var controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach(function (value, index) {

      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          }
        }
      }

      imgFigures.push(<ImgFigure ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} key={index} data={value}/>)
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
});

GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;
