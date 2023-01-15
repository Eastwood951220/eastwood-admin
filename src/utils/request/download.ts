import httpRequest from "@/utils/request/index";
import {blobValidate} from "@/utils";
import {saveAs} from "file-saver";
import {ElMessage} from "element-plus";
import {closeLoading, loading} from "@/utils/loading";

export const download = <D = any>(url: string, params: D, filename: string) => {
    loading({
        target: "body",
        text: "正在下载数据，请稍候",
        background: "rgba(0, 0, 0, 0.7)",
    })
    return httpRequest<D, downloadResponse>({
        url: url,
        method: "post",
        params: params,
        headers: {
            "isDownload": true,
            "downloadFilename": encodeURIComponent(filename)
        }
    }).then(async res => {
        const isBlob = await blobValidate(res.data);
        if (isBlob) {
            const blob = new Blob([res.data])
            saveAs(blob, res.filename)
            closeLoading()
        } else {
            const resText = await res.data.text();
            const rspObj = JSON.parse(resText);
            const errMsg = rspObj.msg
            ElMessage.error(errMsg);
            closeLoading()
        }
    }).catch((r) => {
        console.error(r)
        ElMessage.error('下载文件出现错误，请联系管理员！')
        closeLoading()
    })
}