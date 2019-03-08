#  Dice2Win
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/)
```
Dice2Win introduction
```
## :earth_asia: Environment
### :wrench: 开发工具
```
0.ReactNative[JS]：Visual Studio code V1.32.0
1.iOS：Xcode V10.1
2.Android：Android Studio V3.2.1
```
### :blue_book: 开发环境
```
"react": "16.3.1",
"react-native": "^0.55.3",
```

## :arrow_down: Setup

**Step 1:** `git clone` [repo]（git@gitlab.f3m.club:dice/dice2win_rn_sc.git)

**Step 2:** `npm install`

**Step 3:** `react-native link`

**Step 4:**
```
编辑 node_modules/react-native/React.podspec 在exclude_files下添加 "React/Fabric/*",
ss.exclude_files = "**/__tests__/*",
                  "IntegrationTests/*",
                  "React/DevSupport/*",
                  "React/Inspector/*",
                  "ReactCommon/yoga/*",
                  "React/Cxx*/*",
                  "React/Fabric/*",
```
**Step 5:** `cd ios && pod install && cd ..`

## :arrow_forward: Run App

1. cd to the repo
2. Run Build for either OS
  * for iOS
    * run `react-native run-ios` or  `npm start ipx`
  * for Android
    * Run Genymotion
    * run `react-native run-android`

## :closed_lock_with_key: Secrets
### xcode 10 third-party相关错误解决方案
**Step 1:**
```
cd  node_modules/react-native/scripts && ./ios-install-third-party.sh && cd ../../../
```
**Step 2:**
```
cd node_modules/react-native/third-party/glog-0.3.4/ && ../../scripts/ios-configure-glog.sh && cd ../../../../
```
**Step 3:**
```
cp ios/build/Build/Products/Debug-iphonesimulator/libfishhook.a  node_modules/react-native/Libraries/WebSocket/
```
