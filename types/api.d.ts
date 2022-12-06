declare global {
    type BasePageParams<P extends Record<string, any> = unknown> = {
        pageNum: number,
        pageSize: number,
    } & P;
}
export {}