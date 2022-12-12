import * as elementPlusIconsVue from '@element-plus/icons-vue';
import {App, Component, h} from 'vue';


export function installIcon(app: App) {
    function componentIcon(name: string, iconComponent: Component) {
        app.component(name, {
            props: {
                size: [Number, String],
                color: String,
            },
            render() {
                let fontSize: string | undefined;
                if (this.size) {
                    if (typeof this.size === 'string') {
                        fontSize = this.size;
                    } else {
                        fontSize = `${this.size as string}px`;
                    }
                }
                return h(
                    'i',
                    {
                        class: 'el-icon',
                        style: {
                            fontSize,
                            color: this.color,
                        },
                    },
                    h(iconComponent),
                );
            },
        });
    }

    // 注册element icons
    for (const [key, component] of Object.entries(elementPlusIconsVue)) {
        componentIcon(`ElIcon${key}`, component);
    }
}
