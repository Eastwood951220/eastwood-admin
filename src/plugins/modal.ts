import {ElMessage, ElMessageBox} from "element-plus";

export default {
    // 消息提示
    msg(content: string) {
        ElMessage.info(content)
    },
    // 错误消息
    msgError(content: string) {
        ElMessage.error(content)
    },
    // 成功消息
    msgSuccess(content: string) {
        ElMessage.success(content)
    },
    // 确认窗体
    confirm(content: string) {
        return ElMessageBox.confirm(content, "系统提示", {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: "warning",
        })
    },
}