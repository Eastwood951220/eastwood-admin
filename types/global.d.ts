import {_RouteRecordBase} from "vue-router";

declare global {
    export interface SidebarRouter extends _RouteRecordBase {
        component: String,
        noShowingChildren?: Boolean,
        children?: SlideRouter[],
    }

    export interface ScssVariables {
        menuColor: string;
        menuLightColor: string;
        menuColorActive: string;
        menuBackground: string;
        menuLightBackground: string;
        subMenuBackground: string;
        subMenuHover: string;
        sideBarWidth: string;
        logoTitleColor: string;
        logoLightTitleColor: string
    }
}

export {}