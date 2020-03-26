module.exports = {
  devServer: {
    proxy: "https://api.vk.com"
  },
  publicPath: process.env.NODE_ENV === "production" ? "/vue-rest-api-vk/" : "/"
};
