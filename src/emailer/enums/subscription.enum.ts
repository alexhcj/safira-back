export enum SubscribeEmailsChainTimingsEnum {
  SUBSCRIBED_ONBOARD = +process.env.EMAIL_SUBSCRIBED_ONBOARD, // 1 min
  SUBSCRIBED_AUTHOR = +process.env.EMAIL_SUBSCRIBED_AUTHOR, // 3 min
  MOST_POPULAR_PRODUCTS = +process.env.EMAIL_MOST_POPULAR_PRODUCTS, // 5 min
}
