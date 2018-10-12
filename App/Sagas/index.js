import { takeLatest, all, take, call } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { ActivityTypes } from '../Redux/ActivityRedux'
import { RecordTypes } from '../Redux/RecordRedux'
import { WalletTypes } from '../Redux/WalletRedux'
import { GameTypes } from '../Redux/GameRedux'
import { ConfigTypes } from '../Redux/ConfigRedux'
import { SettingTypes } from '../Redux/SettingRedux'
import { NotificationTypes } from '../Redux/NotificationRedux'
import { UserTypes } from '../Redux/UserRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { getActivity } from './ActivitySagas'
import { getRecord, getGameRecords } from './RecordSagas'
import { getConfig, socketInit, watchSocketStatusChannel } from './ConfigSagas'
import { initWallet, getWallet, newWallet, saveWallet, importFromMnemonic, unlockWallet, encryptWallet, importEncryptWallet, transfer, getRandom, placeBet } from './WalletSagas'
import { setStake } from './GameSagas'
import { getSetting } from './SettingSagas'
import { getNotification, initNotification, watchNotificationStatusChannel } from './NotificationSagas'
import { register, getUser} from './UserSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    call(watchSocketStatusChannel),
    call(watchNotificationStatusChannel),
    // some sagas only receive an action
    // takeLatest(StartupTypes.STARTUP, startup),


    // User Sagas
    takeLatest(UserTypes.REGISTER, register, api),
    takeLatest(UserTypes.USER_REQUEST, getUser, api),

    // get data for activities
    takeLatest(ActivityTypes.ACTIVITY_REQUEST, getActivity, api),

    // socket operations
    takeLatest(ConfigTypes.SOCKET_INIT, socketInit, api),

    // get records
    takeLatest(RecordTypes.RECORD_REQUEST, getRecord, api),

    // get config
    takeLatest(ConfigTypes.CONFIG_REQUEST, getConfig, api),

    // get setting info
    takeLatest(SettingTypes.SETTING_REQUEST, getSetting, api),

    // Wallet Sagas
    takeLatest(WalletTypes.WALLET_REQUEST, getWallet, api),
    takeLatest(WalletTypes.NEW_WALLET, newWallet, api),
    takeLatest(WalletTypes.SAVE_WALLET, saveWallet, api),
    takeLatest(WalletTypes.IMPORT_FROM_MNEMONIC, importFromMnemonic, api),
    takeLatest(WalletTypes.UNLOCK_WALLET, unlockWallet, api),
    takeLatest(WalletTypes.ENCRYPT_WALLET, encryptWallet, api),
    takeLatest(WalletTypes.IMPORT_ENCRYPT_WALLET, importEncryptWallet, api),
    takeLatest(WalletTypes.TRANSFER, transfer, api),
    takeLatest(WalletTypes.GET_RANDOM, getRandom, api),
    takeLatest(WalletTypes.PLACE_BET, placeBet, api),
    takeLatest(WalletTypes.INIT_WALLET, initWallet, api),

    // Game Sagas
    takeLatest(GameTypes.SET_STAKE, setStake, api),

    // Notification Saga
    takeLatest(NotificationTypes.INIT_NOTIFICATION, initNotification, api)

  ])
}
