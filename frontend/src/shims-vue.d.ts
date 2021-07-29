declare module "*.vue" {
  interface VueConstructor {
    $toast: any;
  }

  import Vue from "vue";
  export default Vue;
}
