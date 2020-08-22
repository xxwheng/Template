import store from '../store'
//import lrz from "lrz";
// 图片上传
const upload = {
    // 选择图片
    chooseImage: function ({
        sizeType = ['compressed'],
        sourceType = ['album', 'camera'],
        count = 9
    }) {
        return new Promise((resolve, reject) => {
            uni.chooseImage({
                count: count, // 默认9
                sizeType: sizeType, // 可以指定是原图还是压缩图，默认压缩图
                sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    resolve(res.tempFilePaths);
                },
                fail: function (error) {
                    reject(error)
                }
            })
        });
    },
    uploadFile: function (that, file, url, type = 0) {
        var userinfo = store.state.userInfo
		var admin_info = {
			token : userinfo['token'],
			skiller_id: userinfo['skiller_id'],
			club_id : userinfo['club_id']
		}
        return new Promise((resolve, reject) => {
            const uploadTask = wx.uploadFile({
                url: url,
                filePath: file,
                name: 'file',
                formData: admin_info,
                success: function (res) {
                    var data = JSON.parse(res.data)
                    if (data.code > 0) {
                        reject(res);
                    } else {
                        var result = {
                            imagepath: data.data.domain + data.data.path,
                            domain: data.data.domain,
                            path: data.data.path
                        }
                        resolve(result);
                    }
                },
                fail: function (error) {
                    reject(error);
                }
            })
        })
    },
    localUpload: function ({
        files = [],
        name = 'file',
        formData,
        header = {},
        dir = '',
        url = ''
    }) {
        var formDataObj = {
            methodName: 'FileUpload'
        };
        if (formData && formData instanceof Object) {
            formDataObj = Object.assign(formData, formDataObj);
        }
        return new Promise((resolve, reject) => {
            if (files && files instanceof Array && files.length > 0) {
                var promiseList = [];
                for (var i = 0; i < files.length; i++) {
                    promiseList[i] = new Promise((resolve, reject) => {
                        uni.uploadFile({
                            url: url, //接口地址
                            filePath: files[i],
                            name: name,
                            formData: formDataObj,
                            header: header,
                            success: function (res) {
                                resolve(res.data);
                            },
                            fail: function (error) {
                                reject(error);
                            }
                        });
                    });
                }
                Promise.all(promiseList)
                    .then(function (result) {
                        resolve(result);
                    })
                    .then(function (error) {
                        reject(error);
                    });
            } else {
                reject('传参有误，请传数组格式');
            }
        });
    },

    //阿里直传
    ossUpload: function (that, file) {},

    //lrz 压缩
    //https://www.npmjs.com/package/lrz
    lrzImg: function (that, canvasId, canWidth, canHeight, files, tips, maxwidth = 500, maxheight = 500) {

    },
    /**
     * drawCanvas 【压缩图片 -->单张】
     * @param  that            
     * @param {String}  canvasId        Canvas的选择器
     * @param {String}  canWidth        Canvas的宽
     * @param {String}  canHeight       Canvas的高
     * @param {String}  files           图片文件
     * @param {String}  tips            上传文件提示
     */
    drawCanvas: function (that, canvasId, canWidth, canHeight, files, tips, maxwidth = 500, maxheight = 500) { // 缩放图片
        var _that = that,
            filesArr = [],
            $maxwidth = maxwidth,
            $maxheight = maxheight,
            $widthratio = 0,
            $heightratio = 0,
            $resizewidth_tag = false,
            $resizeheight_tag = false,
            $ratio = 0,
            $newwidth = 0,
            $newheight = 0;
        return new Promise((resolve, reject) => {
            const ctx = uni.createCanvasContext(canvasId);
            uni.getImageInfo({ //拿图片信息
                src: files,
                success: function (res) {
                    //构造画板宽高
                    _that.canWidth = canWidth
                    _that.canWidth = canHeight
                    let fileType = res.type,
                        $pic_width = res.width,
                        $pic_height = res.height;
                    if (res.width > maxwidth || res.height > maxheight) { //判断图片是否超过500像素
                        if ($maxwidth && $pic_width > $maxwidth) {
                            $widthratio = $maxwidth / $pic_width;
                            $resizewidth_tag = true;
                        }

                        if ($maxheight && $pic_height > $maxheight) {
                            $heightratio = $maxheight / $pic_height;
                            $resizeheight_tag = true;
                        }

                        if ($resizewidth_tag && $resizeheight_tag) {
                            if ($widthratio < $heightratio)
                                $ratio = $widthratio;
                            else
                                $ratio = $heightratio;
                        }

                        if ($resizewidth_tag && !$resizeheight_tag)
                            $ratio = $widthratio;
                        if ($resizeheight_tag && !$resizewidth_tag)
                            $ratio = $heightratio;

                        $newwidth = $pic_width * $ratio;
                        $newheight = $pic_height * $ratio;
                        let scale = res.width / res.height //获取原图比例
                        $newwidth = parseInt($newwidth);
                        $newheight = parseInt($newheight);
                        //构造画板宽高
                        _that.canWidth = $newwidth,
                            _that.canHeight = $newheight

                        // _that.setData({
                        //   //构造画板宽高
                        //   canWidth: canWidth,
                        //   canHeight: canHeight / scale
                        // });
                        // console.log( $newwidth, $newheight)
                        //画出压缩图片
                        ctx.drawImage(files, 0, 0, $newwidth, $newheight);
                        // console.log($newwidth, $newheight)
                        //ctx.drawImage(files, 0, 0, _that.data.canWidth, _that.data.canHeight);
                        ctx.draw();
                        //等待压缩图片生成
                        var st = setTimeout(function () {
                            // 获取压缩图片路径
                            uni.canvasToTempFilePath({
                                width: $newwidth,
                                height: $newheight,
                                // width: _that.canWidth,
                                // height: _that.canHeight,
                                fileType: 'jpg',
                                quality: 0.9,
                                canvasId: canvasId,
                                success: function success(res) {
                                    resolve(res.tempFilePath);
                                },
                                fail: function (error) {
                                    reject(error)
                                }
                            }, _that);
                            clearTimeout(st);
                        }, 800);
                    } else {
                        //返回图片路径
                        resolve(files);
                    }
                },
                fail: function (error) {
                    reject(error)
                }
            })
        })
    }
}

export default upload