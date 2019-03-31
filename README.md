#  Dice2Win
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/)
```
    ETH4fun is a demo powered by Ethereum State-channel. ETH4fun includes an Ethereum digital currency wallet with open&close channel and splice in&out besides basic wallet functions.
    A simple dice game with auto mining operated on Rinkeby test net is also included to let you try our demo with a better experience.
    Have some fun on our layer2-based, fast, easy, and secure dice game!
```
## :arrow_down: Setup

**Step 1:** `git clone https://github.com/shuaijianjian/eth4fun.git`

**Step 2:** `npm install`

**Step 3:** `react-native link`

**Step 4:** `cd ios && pod install && cd ..`

## :arrow_forward: Run App

1. cd to the repo
2. Run Build for either OS
  * for iOS
    * run `react-native run-ios`
    * or  `npm start ipx`
  * for Android (真机调试)
    * 001: `adb reverse tcp:8081 tcp:8081`
    * 002: Android Studio :arrow_forward:

## :closed_lock_with_key: Secrets

### xcode 10 third-party相关错误解决方案
```
Step 1
cd  node_modules/react-native/scripts && ./ios-install-third-party.sh && cd ../../../

Step 2
cd node_modules/react-native/third-party/glog-0.3.4/ && ../../scripts/ios-configure-glog.sh && cd ../../../../

Step 3
cp ios/build/Build/Products/Debug-iphonesimulator/libfishhook.a  node_modules/react-native/Libraries/WebSocket/
```

## :potable_water: Rinkeby Authenticated Faucet
[Faucet](https://www.rinkeby.io/#faucet)

## :satellite: Link
[React Native中文网](https://reactnative.cn/)

[Redux 中文文档](https://www.redux.org.cn/s)

[Ignite CLI](https://vuex.vuejs.org/zh/)
