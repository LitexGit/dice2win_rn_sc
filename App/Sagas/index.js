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
import { ChannelTypes } from '../Redux/ChannelRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { getActivity } from './ActivitySagas'
import { getRecord, handleGlobal } from './RecordSagas'
import { getConfig, socketInit, watchSocketStatusChannel } from './ConfigSagas'
import { navigateToBottomTab, initWallet, getWallet, newWallet, saveWallet, importFromMnemonic, unlockWallet, encryptWallet, importEncryptWallet, transfer, getRandom, placeBet, withdraw } from './WalletSagas'
import { setStake, refreshStatus } from './GameSagas'
import { getSetting } from './SettingSagas'
import { getNotification, initNotification, watchNotificationStatusChannel } from './NotificationSagas'
import { register, getUser, fetchInviteCode } from './UserSagas'
import { getChannel, openChannel, closeChannel, deposit, startBet, getAllChannels, getAllBets, getBetById, watchChannelListener, getPayments} from './ChannelSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    call(watchSocketStatusChannel),
    call(watchNotificationStatusChannel),
    // 监听 Channel 开通、下注
    call(watchChannelListener),
    // some sagas only receive an action
    // takeLatest(StartupTypes.STARTUP, startup),


    // User Sagas
    takeLatest(UserTypes.REGISTER, register, api),
    takeLatest(UserTypes.USER_REQUEST, getUser, api),
    takeLatest(UserTypes.FETCH_INVITE_CODE, fetchInviteCode, api),

    // get data for activities
    takeLatest(ActivityTypes.ACTIVITY_REQUEST, getActivity, api),

    // socket operations
    takeLatest(ConfigTypes.SOCKET_INIT, socketInit, api),

    // get records
    takeLatest(RecordTypes.RECORD_REQUEST, getRecord, api),
    takeLatest(RecordTypes.HANDLE_GLOBAL, handleGlobal, api),

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
    takeLatest(WalletTypes.NAVIGATE_TO_BOTTOM_TAB, navigateToBottomTab, api),
    takeLatest(WalletTypes.WITHDRAW, withdraw, api),

    // Game Sagas
    takeLatest(GameTypes.SET_STAKE, setStake, api),
    takeLatest(GameTypes.REFRESH_STATUS, refreshStatus, api),

    // Channel Sagas
    takeLatest(ChannelTypes.CHANNEL_REQUEST, getChannel, api),
    takeLatest(ChannelTypes.OPEN_CHANNEL, openChannel, api),
    takeLatest(ChannelTypes.CLOSE_CHANNEL, closeChannel, api),
    takeLatest(ChannelTypes.DEPOSIT, deposit, api),
    takeLatest(ChannelTypes.START_BET, startBet, api),
    takeLatest(ChannelTypes.GET_ALL_CHANNELS, getAllChannels, api),
    // takeLatest(ChannelTypes.GET_CHANNEL_INFO, getChannelInfo, api),
    takeLatest(ChannelTypes.GET_ALL_BETS, getAllBets, api),
    takeLatest(ChannelTypes.GET_BET_BY_ID, getBetById, api),
    takeLatest(ChannelTypes.GET_PAYMENTS, getPayments, api),

    // Notification Saga
    takeLatest(NotificationTypes.INIT_NOTIFICATION, initNotification, api)

  ])
}
