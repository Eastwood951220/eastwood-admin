import nProgress from "nprogress";
import 'nprogress/nprogress.css';

nProgress.configure({
    easing: 'ease', // 动画方式
    speed: 1000, // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3, // 更改启动时使用的最小百分比
    parent: 'body', //指定进度条的父容器
})

let number = 0

export const done = (n = 1) => {
    number -= n;
    if (number <= 0) {
        nProgress.done();
        number = 0;
    } else {
        nProgress.set(number / (number + n));
    }
};

export const start = (n = 1) => {
    if (number <= 0) {
        nProgress.start();
        number = n;
    } else {
        number += n;
    }
};

export const set = (n: number) => {
    if (number > 0) {
        nProgress.set(n);
    }
};

export const remove = () => {
    number = 0;
    nProgress.remove();
};