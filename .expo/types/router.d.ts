/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(carts)` | `/(carts)/cart` | `/(carts)/checkout` | `/(carts)/orderConfirmation` | `/(home)` | `/(home)/` | `/(legal)` | `/(legal)/details` | `/(legal)/legal` | `/(profile)` | `/(profile)/(legal)` | `/(profile)/(legal)/details` | `/(profile)/(legal)/legal` | `/(profile)/about` | `/(profile)/details` | `/(profile)/editProfile` | `/(profile)/faq` | `/(profile)/help` | `/(profile)/legal` | `/(profile)/profile` | `/(tabs)` | `/(tabs)/` | `/(tabs)/(carts)` | `/(tabs)/(carts)/cart` | `/(tabs)/(carts)/checkout` | `/(tabs)/(carts)/orderConfirmation` | `/(tabs)/(home)` | `/(tabs)/(home)/` | `/(tabs)/(legal)` | `/(tabs)/(legal)/details` | `/(tabs)/(legal)/legal` | `/(tabs)/(profile)` | `/(tabs)/(profile)/(legal)` | `/(tabs)/(profile)/(legal)/details` | `/(tabs)/(profile)/(legal)/legal` | `/(tabs)/(profile)/about` | `/(tabs)/(profile)/details` | `/(tabs)/(profile)/editProfile` | `/(tabs)/(profile)/faq` | `/(tabs)/(profile)/help` | `/(tabs)/(profile)/legal` | `/(tabs)/(profile)/profile` | `/(tabs)/about` | `/(tabs)/cart` | `/(tabs)/checkout` | `/(tabs)/details` | `/(tabs)/editProfile` | `/(tabs)/faq` | `/(tabs)/help` | `/(tabs)/legal` | `/(tabs)/orderConfirmation` | `/(tabs)/profile` | `/_sitemap` | `/about` | `/cart` | `/checkout` | `/details` | `/editProfile` | `/faq` | `/help` | `/legal` | `/orderConfirmation` | `/profile`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
