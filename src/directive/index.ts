import {App} from "vue";
import hasPermission from "@/directive/permission/hasPermission";
import hasRole from "@/directive/permission/hasRole";
import autoHeight from "@/directive/autoHeight";

export function setupDirective(app: App<Element>) {
    app.directive('auto-height', autoHeight)
    app.directive('has-permission', hasPermission)
    app.directive('has-role', hasRole)
}