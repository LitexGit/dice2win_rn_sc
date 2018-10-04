export default (userInfo: object) => {
    let {
        uid, nickname, eth_address, inviter, aff_code, balance
    } = userInfo

    return {
        uid, nickname, address:eth_address, inviter, code: aff_code, bonus: balance
    }
}