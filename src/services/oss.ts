import Taro, { RequestParams } from "@tarojs/taro";
/**随机数 */
const randomString = (len: any) => {
    len = len || 32;
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
const host = 'https://oss.tdianyi.com';
export default async function upload(files: any) {
    console.log(files)
    const imgUrl = files[0];
    const length = 14680064;
    if (imgUrl.length > length) {
        Taro.showToast({ title: '上传失败，请上传小于10M的图片', icon: 'none' })
        return new Promise(() => { });
    } else {
        if (!Taro.getStorageSync("oss_data")) {
            Taro.hideLoading()
            Taro.showToast({ title: '上传失败，请重新上传', icon: 'none' })
            /**获取oss */
            Taro.request(
                {
                    url: 'http://api.supplier.tdianyi.com/api/v2/up',
                    method: "GET",
                }
            ).then(res => {
                let { data } = res.data;
                let oss_data = {
                    policy: data.policy,
                    OSSAccessKeyId: data.accessid,
                    success_action_status: 200, //让服务端返回200,不然，默认会返回204
                    signature: data.signature,
                    callback: data.callback,
                    host: data.host,
                    key: data.dir
                };
                Taro.setStorageSync("oss_data", JSON.stringify(oss_data))
            })
        }
        let oss_data = JSON.parse(Taro.getStorageSync("oss_data") || '');
        let key = oss_data.key + randomString(32) + '.jpg'
        return Taro.uploadFile({
            url: host,
            filePath: imgUrl,
            name: 'file',
            formData: {
                key: key,
                policy: oss_data.policy,
                OSSAccessKeyId: oss_data.OSSAccessKeyId,
                signature: oss_data.signature,
                success_action_status: '200',
                callback: oss_data.callback,
                file: imgUrl
            },
            success: (res) => {
            }
        })
    }

}

